import type { ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: Icon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <Icon size={32} className="text-muted-foreground" aria-hidden="true" />
      <p className="font-medium text-foreground">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
