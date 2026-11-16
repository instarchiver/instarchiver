import {
  COLUMNS_2_3_4_5,
  type GridColumns,
} from "@/components/ui/grid-columns";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-muted motion-reduce:animate-none ${className}`}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton({
  aspectClass = "aspect-square",
  showFooter = true,
}: {
  aspectClass?: string;
  showFooter?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Skeleton className={`${aspectClass} w-full rounded-none`} />
      {showFooter && (
        <div className="space-y-2 p-3">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      )}
    </div>
  );
}

export function UserCardSkeleton() {
  return (
    <div className="flex h-full flex-col items-center gap-3 rounded-xl border border-border bg-card p-4 text-center">
      <Skeleton className="h-24 w-24 rounded-full" />
      <div className="flex w-full flex-col items-center">
        <Skeleton className="my-0.5 h-5 w-2/3" />
        <Skeleton className="my-0.5 h-4 w-1/2" />
        <Skeleton className="mt-1.5 mb-0.5 h-3 w-1/3" />
      </div>
    </div>
  );
}

export function CardSkeletonGrid({
  count = 12,
  columns = COLUMNS_2_3_4_5,
  aspectClass = "aspect-square",
  showFooter = true,
  variant = "media",
}: {
  count?: number;
  columns?: GridColumns;
  aspectClass?: string;
  showFooter?: boolean;
  variant?: "media" | "user";
}) {
  return (
    <div className={`grid gap-4 ${columns.className}`}>
      {Array.from({ length: count }).map((_, i) =>
        variant === "user" ? (
          <UserCardSkeleton key={i} />
        ) : (
          <CardSkeleton
            key={i}
            aspectClass={aspectClass}
            showFooter={showFooter}
          />
        )
      )}
    </div>
  );
}
