"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogo, UserPlus, X } from "@phosphor-icons/react";
import { useMounted } from "@/components/hooks/use-mounted";
import { Spinner } from "@/components/ui/spinner";
import { isCancelledPopup, useLoginWithGoogle, useMe } from "@/hooks/use-auth";
import { useCreateUser } from "@/hooks/use-users";
import { getApiErrorMessage } from "@/lib/api/client";

const PRIMARY_BUTTON =
  "flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-wait disabled:opacity-60";
const GHOST_BUTTON =
  "flex min-h-11 cursor-pointer items-center rounded-lg px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60";

export function AddUserButton({ className = "" }: { className?: string }) {
  const mounted = useMounted();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  if (!mounted) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className={`${PRIMARY_BUTTON} shrink-0 ${className}`}
      >
        <UserPlus size={16} />
        Add user
      </button>
      <AddUserDialog dialogRef={dialogRef} />
    </>
  );
}

function AddUserDialog({
  dialogRef,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
}) {
  const router = useRouter();
  const { user, isLoadingUser } = useMe();
  const login = useLoginWithGoogle();
  const createUser = useCreateUser();
  const [username, setUsername] = useState("");
  const [validationError, setValidationError] = useState<string>();

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

  function resetForm() {
    setUsername("");
    setValidationError(undefined);
    createUser.reset();
    login.reset();
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // The backend stores the username as sent, so strip the "@" people
    // tend to paste along with it.
    const normalized = username.trim().replace(/^@/, "");
    if (!normalized) {
      setValidationError("Enter an Instagram username.");
      return;
    }
    setValidationError(undefined);
    createUser.mutate(
      { username: normalized },
      {
        onSuccess: (user) => {
          dialogRef.current?.close();
          router.push(`/users/${user.uuid}`);
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
              <GoogleLogo size={16} weight="bold" />
            )}
            Log in with Google
          </button>
        </div>
      </div>
    );
  } else {
    body = (
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="add-user-username" className="sr-only">
            Instagram username
          </label>
          <div className="relative flex min-h-11 items-center rounded-lg border border-border bg-card focus-within:ring-2 focus-within:ring-ring">
            <span className="pl-3 text-sm text-muted-foreground">@</span>
            <input
              id="add-user-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isPending}
              placeholder="username"
              autoFocus
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
            <span className="mr-auto flex items-center gap-2 text-sm text-muted-foreground">
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
      onClose={resetForm}
      onCancel={(e) => {
        if (isPending) e.preventDefault();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border border-border bg-card p-0 text-foreground shadow-md backdrop:bg-black/50"
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
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={18} />
          </button>
        </div>
        {body}
      </div>
    </dialog>
  );
}
