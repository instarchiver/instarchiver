"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import type { Icon } from "@phosphor-icons/react";
import { useIntersectionObserver } from "@/components/hooks/use-intersection-observer";
import { CardSkeletonGrid } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Spinner } from "@/components/ui/spinner";
import type { GridColumns } from "@/components/ui/grid-columns";

const COLUMN_BREAKPOINTS: Array<[number, keyof GridColumns["counts"]]> = [
  [1280, "xl"],
  [1024, "lg"],
  [768, "md"],
  [640, "sm"],
];

function resolveColumnCount(width: number, counts: GridColumns["counts"]): number {
  for (const [minWidth, key] of COLUMN_BREAKPOINTS) {
    const value = counts[key];
    if (width >= minWidth && value) return value;
  }
  return counts.base;
}

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
  columns: GridColumns;
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
  columns,
}: InfiniteGridProps<T>) {
  const onIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useIntersectionObserver(
    onIntersect,
    hasNextPage && !isLoading && !isError
  );

  const [containerNode, setContainerNode] = useState<HTMLDivElement | null>(null);
  const [columnCount, setColumnCount] = useState(columns.counts.base);
  const [scrollMargin, setScrollMargin] = useState(0);

  useLayoutEffect(() => {
    if (!containerNode) return;

    const observer = new ResizeObserver(([entry]) => {
      setColumnCount(resolveColumnCount(entry.contentRect.width, columns.counts));
      setScrollMargin(containerNode.offsetTop);
    });
    observer.observe(containerNode);
    return () => observer.disconnect();
  }, [containerNode, columns.counts]);

  const rowCount = Math.ceil(items.length / columnCount);

  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => 280,
    overscan: 3,
    scrollMargin,
    // avoids "flushSync called during render" warning from tanstack-virtual's default sync measurement
    useFlushSync: false,
  });

  if (isLoading) return <CardSkeletonGrid />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  if (items.length === 0) {
    return (
      <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <div ref={setContainerNode}>
      <div style={{ position: "relative", height: rowVirtualizer.getTotalSize() }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const start = virtualRow.index * columnCount;
          const rowItems = items.slice(start, start + columnCount);
          const isLastRow = virtualRow.index === rowCount - 1;
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              className={`absolute left-0 top-0 w-full ${isLastRow ? "" : "pb-4"}`}
              style={{
                transform: `translateY(${
                  virtualRow.start - rowVirtualizer.options.scrollMargin
                }px)`,
              }}
            >
              <div className={`grid gap-4 ${columns.className}`}>
                {rowItems.map((item) => (
                  <div key={getKey(item)}>{renderItem(item)}</div>
                ))}
              </div>
            </div>
          );
        })}
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
