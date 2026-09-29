"use client";

import { useEffect, useRef, useState } from "react";
import { SignOut } from "@phosphor-icons/react";
import { useMounted } from "@/components/hooks/use-mounted";
import { Avatar } from "@/components/users/avatar";
import { useLoginWithGoogle, useLogout, useMe } from "@/hooks/use-auth";

const CANCELLED_POPUP_CODES = new Set([
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
]);

function isCancelledPopup(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    CANCELLED_POPUP_CODES.has(String(error.code))
  );
}

export function UserMenu() {
  const mounted = useMounted();
  const { user, isLoadingUser } = useMe();
  const login = useLoginWithGoogle();

  if (!mounted || isLoadingUser) {
    return <div className="h-11 w-11 rounded-lg" aria-hidden="true" />;
  }

  if (user) {
    return <AccountDropdown user={user} />;
  }

  const loginError =
    login.error && !isCancelledPopup(login.error)
      ? "Sign in failed. Please try again."
      : undefined;

  return (
    <button
      type="button"
      onClick={() => login.mutate()}
      disabled={login.isPending}
      title={loginError}
      className={`flex min-h-11 cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-wait disabled:opacity-60 ${
        loginError ? "text-destructive" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      Login
    </button>
  );
}

function AccountDropdown({
  user,
}: {
  user: { name: string; username: string; email: string; photo_url: string };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const logout = useLogout();
  const displayName = user.name || user.username;

  useEffect(() => {
    if (!isOpen) return;

    function onMouseDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Account menu for ${displayName}`}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Avatar src={user.photo_url || null} alt={displayName} size="sm" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-1 w-64 rounded-lg border border-border bg-card p-1 shadow-md"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium text-foreground">
              {displayName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email || `@${user.username}`}
            </p>
          </div>
          <div className="my-1 border-t border-border" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-muted focus:outline-none focus-visible:bg-muted"
          >
            <SignOut size={16} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
