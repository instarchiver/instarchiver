"use client";

import { useEffect, useId, useRef, useState } from "react";
import { SignOut } from "@phosphor-icons/react";
import { useMounted } from "@/components/hooks/use-mounted";
import { Avatar } from "@/components/users/avatar";
import {
  isCancelledPopup,
  useLoginWithGoogle,
  useLogout,
  useMe,
} from "@/hooks/use-auth";

export function UserMenu() {
  const mounted = useMounted();
  const { user, isLoadingUser } = useMe();
  const login = useLoginWithGoogle();
  const errorId = useId();

  if (!mounted || isLoadingUser) {
    return <div className="h-11 w-16 rounded-lg" aria-hidden="true" />;
  }

  if (user) {
    return <AccountDropdown user={user} />;
  }

  const loginError =
    !login.isPending && login.error && !isCancelledPopup(login.error)
      ? "Sign in failed. Please try again."
      : undefined;

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={() => login.mutate()}
        disabled={login.isPending}
        aria-describedby={loginError ? errorId : undefined}
        className={`flex min-h-11 cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-wait disabled:opacity-60 ${
          loginError
            ? "text-destructive"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Login
      </button>
      {loginError && (
        <p
          id={errorId}
          role="alert"
          className="absolute right-0 top-full z-50 mt-1 w-max max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-destructive shadow-md"
        >
          {loginError}
        </p>
      )}
    </div>
  );
}

function AccountDropdown({
  user,
}: {
  user: { name: string; username: string; email: string; photo_url: string };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const firstItemRef = useRef<HTMLButtonElement | null>(null);
  const logout = useLogout();
  const displayName = user.name || user.username;

  useEffect(() => {
    if (!isOpen) return;

    firstItemRef.current?.focus();

    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      } else if (e.key === "Tab") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onBlur={(e) => {
        if (
          isOpen &&
          !e.currentTarget.contains(e.relatedTarget as Node | null)
        ) {
          setIsOpen(false);
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !isOpen) {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
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
          className="absolute right-0 z-50 mt-1 w-64 origin-top-right rounded-lg border border-border bg-card p-1 shadow-md transition-[opacity,scale] duration-150 ease-out-expo starting:scale-95 starting:opacity-0 motion-reduce:starting:scale-100"
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
            ref={firstItemRef}
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-muted focus:outline-none focus-visible:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <SignOut size={16} aria-hidden="true" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
