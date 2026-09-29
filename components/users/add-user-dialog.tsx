"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, X } from "@phosphor-icons/react";
import { useMounted } from "@/components/hooks/use-mounted";
import { Spinner } from "@/components/ui/spinner";
import { useMe } from "@/hooks/use-auth";
import { useCreateUser } from "@/hooks/use-users";
import { getApiErrorMessage } from "@/lib/api/client";

export function AddUserButton({ className = "" }: { className?: string }) {
  const mounted = useMounted();
  const { user, isLoadingUser } = useMe();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // Only signed-in users can add profiles, so hide the button otherwise.
  if (!mounted || isLoadingUser || !user) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className={`flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${className}`}
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
  const createUser = useCreateUser();
  const [username, setUsername] = useState("");
  const [validationError, setValidationError] = useState<string>();

  const isPending = createUser.isPending;
  const errorMessage =
    validationError ??
    (createUser.error
      ? getApiErrorMessage(createUser.error, "Failed to add user.")
      : undefined);

  function close() {
    if (isPending) return;
    dialogRef.current?.close();
  }

  function resetForm() {
    setUsername("");
    setValidationError(undefined);
    createUser.reset();
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
      <form onSubmit={onSubmit} className="flex flex-col gap-4 p-6">
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
            className="flex min-h-11 cursor-pointer items-center rounded-lg px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
          >
            Add user
          </button>
        </div>
      </form>
    </dialog>
  );
}
