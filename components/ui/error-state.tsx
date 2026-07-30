"use client";

import { ArrowClockwise, WarningCircle } from "@phosphor-icons/react";

export function ErrorState({
  message = "Something went wrong while loading this data.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <WarningCircle size={32} className="text-destructive" />
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90"
        >
          <ArrowClockwise size={16} />
          Try again
        </button>
      )}
    </div>
  );
}
