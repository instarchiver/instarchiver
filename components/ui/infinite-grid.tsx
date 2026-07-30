"use client";

import { useCallback } from "react";
import type { Icon } from "@phosphor-icons/react";
import { useIntersectionObserver } from "@/components/hooks/use-intersection-observer";
import { CardSkeletonGrid } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Spinner } from "@/components/ui/spinner";

interface InfiniteGridProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  getKey: (item: T) => string;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  emptyIcon: Icon;
  emptyTitle: string;
  emptyDescription?: string;
  columnsClassName?: string;
}

export function InfiniteGrid<T>({
  items,
  renderItem,
  getKey,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isLoading,
  isError,
  onRetry,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  columnsClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
}: InfiniteGridProps<T>) {
  const onIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useIntersectionObserver(
    onIntersect,
    hasNextPage && !isLoading && !isError
  );

  if (isLoading) return <CardSkeletonGrid />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  if (items.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div>
      <div className={`grid gap-4 ${columnsClassName}`}>
        {items.map((item) => (
          <div key={getKey(item)}>{renderItem(item)}</div>
        ))}
      </div>
      {hasNextPage && (
        <div
          ref={sentinelRef}
          className="flex items-center justify-center py-8"
        >
          <Spinner />
        </div>
      )}
    </div>
  );
}
