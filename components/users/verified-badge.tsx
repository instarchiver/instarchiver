import { LockSimple, SealCheck } from "@phosphor-icons/react";

export function VerifiedBadge() {
  return (
    <span
      aria-label="Verified account"
      title="Verified account"
      className="inline-flex shrink-0 text-accent"
    >
      <SealCheck size={16} weight="fill" aria-hidden="true" />
    </span>
  );
}

export function PrivateBadge() {
  return (
    <span
      aria-label="Private account"
      title="Private account"
      className="inline-flex shrink-0 text-muted-foreground"
    >
      <LockSimple size={14} weight="fill" aria-hidden="true" />
    </span>
  );
}
