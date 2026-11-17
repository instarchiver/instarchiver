"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogo, UserPlus, X } from "@phosphor-icons/react";
import { Spinner } from "@/components/ui/spinner";
import { isCancelledPopup, useLoginWithGoogle, useMe } from "@/hooks/use-auth";
import { useCreateUser } from "@/hooks/use-users";
import { getApiErrorMessage } from "@/lib/api/client";

const PRIMARY_BUTTON =
  "flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-wait disabled:opacity-60";
const GHOST_BUTTON =
  "flex min-h-11 cursor-pointer items-center rounded-lg px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60";

const NON_PROFILE_PATHS = new Set([
  "p",
  "reel",
  "reels",
  "stories",
  "explore",
  "accounts",
  "direct",
  "tv",
]);

function parseInstagramUsername(
  raw: string
): { username: string } | { error: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { error: "Enter an Instagram username." };
  }

  const urlMatch = trimmed.match(
    /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([^/?#]+)/i
  );
  if (urlMatch) {
    const segment = urlMatch[1].replace(/^@/, "");
    if (!segment || NON_PROFILE_PATHS.has(segment.toLowerCase())) {
      return {
        error:
          "Enter an Instagram username or profile link, not a post or story URL.",
      };
    }
    return { username: segment };
  }

  const normalized = trimmed.replace(/^@/, "");
  if (!normalized) {
    return { error: "Enter an Instagram username." };
  }
  return { username: normalized };
}

export function AddUserButton({
  className = "",
  initialUsername,
  label = "Add user",
}: {
  className?: string;
  initialUsername?: string;
  label?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function openDialog() {
    setIsOpen(true);
    dialogRef.current?.showModal();
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className={`${PRIMARY_BUTTON} shrink-0 ${className}`}
      >
        <UserPlus size={16} aria-hidden="true" />
        {label}
      </button>
      <AddUserDialog
        dialogRef={dialogRef}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        initialUsername={initialUsername}
      />
    </>
  );
}

function AddUserDialog({
  dialogRef,
  isOpen,
  onOpenChange,
  initialUsername = "",
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialUsername?: string;
}) {
  const router = useRouter();
  const { user, isLoadingUser } = useMe();
  const login = useLoginWithGoogle();
  const createUser = useCreateUser();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [username, setUsername] = useState(initialUsername);
  const [prevOpen, setPrevOpen] = useState(false);
  const [validationError, setValidationError] = useState<string>();

  if (isOpen && !prevOpen) {
    setPrevOpen(true);
    setUsername(initialUsername);
    setValidationError(undefined);
  } else if (!isOpen && prevOpen) {
    setPrevOpen(false);
  }

  useEffect(() => {
    if (!isOpen || !user || isLoadingUser) return;
    const rafId = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [isOpen, user, isLoadingUser]);

  const isPending = createUser.isPending || login.isPending;
  const errorMessage =
    validationError ??
    (createUser.error
      ? getApiErrorMessage(createUser.error, "Failed to add user.")
      : undefined);
  const loginError =
    login.error && !isCancelledPopup(login.error)
      ? "Sign in failed. Please try again."
      : undefined;

  function close() {
    if (isPending) return;
    dialogRef.current?.close();
  }

  function handleDialogClose() {
    onOpenChange(false);
    setUsername("");
    setValidationError(undefined);
    createUser.reset();
    login.reset();
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = parseInstagramUsername(username);
    if ("error" in parsed) {
      setValidationError(parsed.error);
      return;
    }
    setValidationError(undefined);
    createUser.mutate(
      { username: parsed.username },
      {
        onSuccess: (createdUser) => {
          dialogRef.current?.close();
          router.push(`/users/${createdUser.uuid}`);
        },
      }
    );
  }

  let body: React.ReactNode;
  if (isLoadingUser) {
    body = (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    );
  } else if (!user) {
    body = (
      <div className="flex flex-col gap-4">
        <p className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground">
          You need to be logged in to add users. Log in with Google, then enter
          the username.
        </p>
        {loginError && (
          <p role="alert" className="text-sm text-destructive">
            {loginError}
          </p>
        )}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={close}
            disabled={isPending}
            className={GHOST_BUTTON}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => login.mutate()}
            disabled={login.isPending}
            className={PRIMARY_BUTTON}
          >
            {login.isPending ? (
              <Spinner className="h-4 w-4 text-accent-foreground" />
            ) : (
              <GoogleLogo size={16} weight="bold" aria-hidden="true" />
            )}
            Log in with Google
          </button>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link
            href="/terms"
            onClick={() => dialogRef.current?.close()}
            className="rounded-sm font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            onClick={() => dialogRef.current?.close()}
            className="rounded-sm font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    );
  } else {
    body = (
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="add-user-username" className="sr-only">
            Instagram username or profile link
          </label>
          <div className="relative flex min-h-11 items-center rounded-lg border border-input bg-card focus-within:ring-2 focus-within:ring-ring">
            <span
              className="pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              @
            </span>
            <input
              ref={inputRef}
              id="add-user-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isPending}
              placeholder="username or instagram.com/username"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              maxLength={150}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? "add-user-error" : undefined}
              className="min-h-11 w-full rounded-lg bg-transparent py-2 pr-3 pl-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-60"
            />
          </div>
          {errorMessage && (
            <p
              id="add-user-error"
              role="alert"
              className="mt-2 text-sm text-destructive"
            >
              {errorMessage}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          {isPending && (
            <span
              role="status"
              className="mr-auto flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Spinner className="h-4 w-4" />
              Fetching profile…
            </span>
          )}
          <button
            type="button"
            onClick={close}
            disabled={isPending}
            className={GHOST_BUTTON}
          >
            Cancel
          </button>
          <button type="submit" disabled={isPending} className={PRIMARY_BUTTON}>
            Add user
          </button>
        </div>
      </form>
    );
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="add-user-title"
      onClose={handleDialogClose}
      onCancel={(e) => {
        if (isPending) e.preventDefault();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border border-border bg-card p-0 text-foreground shadow-md transition-[opacity,scale,overlay,display] transition-discrete duration-150 ease-out-expo scale-95 opacity-0 open:scale-100 open:opacity-100 open:duration-200 starting:open:scale-95 starting:open:opacity-0 motion-reduce:scale-100 motion-reduce:starting:open:scale-100 backdrop:bg-black/0 backdrop:transition-[background-color,overlay,display] backdrop:transition-discrete backdrop:duration-150 open:backdrop:bg-black/50 starting:open:backdrop:bg-black/0"
    >
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="add-user-title" className="text-lg font-semibold">
              Add Instagram user
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We&apos;ll fetch the profile and start archiving it. You can add
              up to 3 users a day.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            disabled={isPending}
            aria-label="Close"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        {body}
      </div>
    </dialog>
  );
}
