import { ArrowRight, Globe, LockSimple, SealCheck } from "@phosphor-icons/react";
import { Avatar } from "@/components/users/avatar";
import { formatCount } from "@/lib/format";
import type { HistoryChange } from "@/lib/history-diff";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-24 shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </span>
  );
}

function EmptyValue() {
  return <span className="italic text-muted-foreground">(empty)</span>;
}

function DeltaBadge({ delta }: { delta: number }) {
  const positive = delta > 0;
  return (
    <span
      className={`rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums ${
        positive
          ? "bg-emerald-500/10 text-emerald-600"
          : "bg-destructive/10 text-destructive"
      }`}
    >
      {positive ? "+" : "−"}
      {Math.abs(delta).toLocaleString("en-US")}
    </span>
  );
}

function FlagValue({ field, value }: { field: "is_private" | "is_verified"; value: boolean }) {
  if (field === "is_private") {
    return (
      <span className="inline-flex items-center gap-1">
        {value ? <LockSimple size={14} weight="fill" /> : <Globe size={14} />}
        {value ? "Private" : "Public"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1">
      {value && <SealCheck size={14} weight="fill" className="text-accent" />}
      {value ? "Verified" : "Not verified"}
    </span>
  );
}

const arrow = (
  <ArrowRight size={14} className="shrink-0 text-muted-foreground" aria-label="changed to" />
);

export function HistoryChangeRow({
  change,
  username,
}: {
  change: HistoryChange;
  username: string;
}) {
  switch (change.kind) {
    case "image":
      return (
        <div className="flex items-center gap-3">
          <Label>Photo</Label>
          <Avatar src={change.from} alt={`Previous photo of ${username}`} size="md" />
          {arrow}
          <Avatar src={change.to} alt={`New photo of ${username}`} size="md" />
        </div>
      );

    case "count":
      return (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Label>{change.label}</Label>
          <span
            className="tabular-nums text-muted-foreground"
            title={change.from.toLocaleString("en-US")}
          >
            {formatCount(change.from)}
          </span>
          {arrow}
          <span
            className="font-medium tabular-nums text-foreground"
            title={change.to.toLocaleString("en-US")}
          >
            {formatCount(change.to)}
          </span>
          <DeltaBadge delta={change.delta} />
        </div>
      );

    case "flag":
      return (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Label>{change.label}</Label>
          <span className="text-muted-foreground">
            <FlagValue field={change.field} value={change.from} />
          </span>
          {arrow}
          <span className="font-medium text-foreground">
            <FlagValue field={change.field} value={change.to} />
          </span>
        </div>
      );

    case "text":
      if (change.field === "biography") {
        return (
          <div className="flex flex-col gap-2 text-sm sm:flex-row">
            <Label>{change.label}</Label>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <p
                className={`whitespace-pre-line break-words rounded-lg bg-muted px-3 py-2 text-muted-foreground ${
                  change.from ? "line-through decoration-muted-foreground/50" : ""
                }`}
              >
                {change.from || <EmptyValue />}
              </p>
              <p className="whitespace-pre-line break-words rounded-lg border border-border px-3 py-2 text-foreground">
                {change.to || <EmptyValue />}
              </p>
            </div>
          </div>
        );
      }
      return (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Label>{change.label}</Label>
          <span
            className={`break-all text-muted-foreground ${change.from ? "line-through" : ""}`}
          >
            {change.from || <EmptyValue />}
          </span>
          {arrow}
          <span className="break-all font-medium text-foreground">
            {change.to || <EmptyValue />}
          </span>
        </div>
      );
  }
}
