import { LockSimple, SealCheck } from "@phosphor-icons/react";

export function VerifiedBadge() {
  return (
    <span
      aria-label="Verified account"
      title="Verified account"
      className="inline-flex text-accent"
    >
      <SealCheck size={16} weight="fill" />
    </span>
  );
}

export function PrivateBadge() {
  return (
    <span
      aria-label="Private account"
      title="Private account"
      className="inline-flex text-muted-foreground"
    >
      <LockSimple size={14} weight="fill" />
    </span>
  );
}
