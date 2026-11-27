"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, GoogleLogo } from "@phosphor-icons/react";
import { useMounted } from "@/components/hooks/use-mounted";
import { Spinner } from "@/components/ui/spinner";
import { Avatar } from "@/components/users/avatar";
import { isCancelledPopup, useMe } from "@/hooks/use-auth";
import type { AuthTokens } from "@/lib/api/types";
import { signInWithGoogleForTokens } from "@/lib/auth/google-sign-in";
import { getTokens } from "@/lib/auth/token-storage";

const HANDOFF_TIMEOUT_MS = 20_000;
const EXT_TOKENS_MESSAGE = "INSTARCHIVER_EXT_AUTH_TOKENS";
const EXT_ACK_MESSAGE = "INSTARCHIVER_EXT_AUTH_ACK";

const PRIMARY_BUTTON =
  "flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-wait disabled:opacity-60";
const SECONDARY_BUTTON =
  "flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60";

interface HandoffAck {
  ok: boolean;
  code?: string;
  error?: string;
}

export function ExtensionAuthClient() {
  const mounted = useMounted();
  const { user, isLoadingUser } = useMe();
  const [authState] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.hash.slice(1)).get("state")?.trim() || null;
  });
  const [status, setStatus] = useState<"idle" | "connecting" | "connected">("idle");
  const [forceGoogleSignIn, setForceGoogleSignIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const cleanupHandoffRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Remove the one-time handoff state from the address bar and history.
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    return () => {
      cleanupHandoffRef.current?.();
    };
  }, []);

  function postTokensToExtension(tokens: AuthTokens, state: string): Promise<HandoffAck> {
    return new Promise((resolve) => {
      const origin = window.location.origin;

      function cleanup() {
        window.clearTimeout(timer);
        window.removeEventListener("message", onMessage);
        if (cleanupHandoffRef.current === cleanup) {
          cleanupHandoffRef.current = null;
        }
      }

      function onMessage(event: MessageEvent) {
        if (event.source !== window || event.origin !== origin) return;
        const data = event.data as
          | { type?: unknown; state?: unknown; ok?: unknown; code?: unknown; error?: unknown }
          | undefined;
        if (data?.type !== EXT_ACK_MESSAGE || data.state !== state) return;

        cleanup();
        resolve({
          ok: Boolean(data.ok),
          code: typeof data.code === "string" ? data.code : undefined,
          error: typeof data.error === "string" ? data.error : undefined,
        });
      }

      const timer = window.setTimeout(() => {
        cleanup();
        resolve({
          ok: false,
          error:
            "Did not receive a response from the Instarchiver extension. Make sure it is enabled and reopen sign-in from the extension popup.",
        });
      }, HANDOFF_TIMEOUT_MS);

      cleanupHandoffRef.current?.();
      cleanupHandoffRef.current = cleanup;
      window.addEventListener("message", onMessage);
      window.postMessage(
        { type: EXT_TOKENS_MESSAGE, state, tokens },
        origin
      );
    });
  }

  async function deliverTokens(tokens: AuthTokens) {
    if (!authState) return;
    const ack = await postTokensToExtension(tokens, authState);
    if (ack.ok) {
      setStatus("connected");
      setErrorMessage(undefined);
      return;
    }

    setStatus("idle");
    if (ack.code === "SESSION_EXPIRED") {
      setForceGoogleSignIn(true);
    }
    setErrorMessage(ack.error ?? "Could not connect to the extension.");
  }

  async function handleContinueWithWebSession() {
    if (!authState || status !== "idle") return;
    setErrorMessage(undefined);

    const tokens = getTokens();
    if (!tokens) {
      setForceGoogleSignIn(true);
      setErrorMessage("Your web session is unavailable. Sign in with Google to continue.");
      return;
    }

    setStatus("connecting");
    await deliverTokens(tokens);
  }

  async function handleGoogleSignIn() {
    if (!authState || status !== "idle") return;
    setErrorMessage(undefined);
    setStatus("connecting");

    try {
      const tokens = await signInWithGoogleForTokens();
      await deliverTokens(tokens);
    } catch (error) {
      setStatus("idle");
      if (!isCancelledPopup(error)) {
        setErrorMessage("Sign in failed. Please try again.");
      }
    }
  }

  if (!mounted || isLoadingUser) {
    return (
      <div className="mt-6 flex items-center justify-center rounded-xl border border-border bg-card p-8">
        <Spinner />
      </div>
    );
  }

  if (!authState) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
        Open this page from the Instarchiver Chrome extension popup to connect
        your account.
      </div>
    );
  }

  if (status === "connected") {
    return (
      <div
        role="status"
        className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center"
      >
        <CheckCircle size={32} className="text-success" aria-hidden="true" />
        <p className="text-sm font-medium text-foreground">
          Connected to Instarchiver extension. You can close this tab.
        </p>
      </div>
    );
  }

  const isBusy = status === "connecting";
  const showWebAccount = Boolean(user) && !forceGoogleSignIn;
  const displayName = user ? user.name || user.username : "";

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
      {showWebAccount && user ? (
        <>
          <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
            <Avatar src={user.photo_url || null} alt={displayName} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {displayName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email || `@${user.username}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleContinueWithWebSession}
            disabled={isBusy}
            className={PRIMARY_BUTTON}
          >
            {isBusy ? (
              <Spinner className="h-4 w-4 text-accent-foreground" />
            ) : null}
            Continue as {displayName}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isBusy}
            className={SECONDARY_BUTTON}
          >
            <GoogleLogo size={16} weight="bold" aria-hidden="true" />
            Use another Google account
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isBusy}
          className={PRIMARY_BUTTON}
        >
          {isBusy ? (
            <Spinner className="h-4 w-4 text-accent-foreground" />
          ) : (
            <GoogleLogo size={16} weight="bold" aria-hidden="true" />
          )}
          Sign in with Google
        </button>
      )}

      {errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
