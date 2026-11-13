"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import type { Icon } from "@phosphor-icons/react";
import { useIntersectionObserver } from "@/components/hooks/use-intersection-observer";
import { CardSkeletonGrid } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Spinner } from "@/components/ui/spinner";
import type { GridColumns } from "@/components/ui/grid-columns";
import {
  getCurrentUrlKey,
  markGridRestoreConsumed,
  peekPendingGridRestore,
  saveGridScrollState,
  type SavedGridScrollState,
} from "@/lib/scroll-restoration";

const GAP_PX = 16;
const DEFAULT_ESTIMATED_ROW_HEIGHT = 280;
const OVERSCAN_ROWS = 2;
const PREFETCH_ROW_BUFFER = 6;
const SCROLL_SAVE_DEBOUNCE_MS = 120;

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

function computeEstimatedRowHeight(
  containerWidth: number,
  columnCount: number,
  cardAspectRatio?: number
): number {
  if (!cardAspectRatio || containerWidth <= 0) {
    return DEFAULT_ESTIMATED_ROW_HEIGHT;
  }
  const totalGap = GAP_PX * Math.max(0, columnCount - 1);
  const cardWidth = Math.max(0, (containerWidth - totalGap) / columnCount);
  return Math.round(cardWidth / cardAspectRatio);
}

interface LayoutMetrics {
  width: number;
  columnCount: number;
  scrollMargin: number;
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
  cardAspectRatio?: number;
  scrollKey?: string;
}

interface VirtualizedRowsProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  getKey: (item: T) => string;
  columnsClassName: string;
  width: number;
  columnCount: number;
  scrollMargin: number;
  cardAspectRatio?: number;
  scrollKey: string;
  restoreState: SavedGridScrollState | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  onSettled?: () => void;
}

function VirtualizedRows<T>({
  items,
  renderItem,
  getKey,
  columnsClassName,
  width,
  columnCount,
  scrollMargin,
  cardAspectRatio,
  scrollKey,
  restoreState,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  onSettled,
}: VirtualizedRowsProps<T>) {
  const rowCount = Math.ceil(items.length / columnCount);
  const estimatedRowHeight = computeEstimatedRowHeight(
    width,
    columnCount,
    cardAspectRatio
  );

  const estimateSize = useCallback(
    (index: number) =>
      index === rowCount - 1 ? estimatedRowHeight : estimatedRowHeight + GAP_PX,
    [estimatedRowHeight, rowCount]
  );

  const [initialRestore] = useState(() => {
    if (!restoreState) return undefined;
    const matchesLayout =
      restoreState.columnCount === columnCount &&
      Math.abs(restoreState.width - width) < 2;
    return {
      offset: restoreState.scrollY,
      measurementsCache: matchesLayout ? restoreState.snapshot : undefined,
    };
  });

  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize,
    overscan: OVERSCAN_ROWS,
    scrollMargin,
    initialOffset: initialRestore?.offset,
    initialMeasurementsCache: initialRestore?.measurementsCache,
    directDomUpdates: true,
    useFlushSync: false,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const lastVirtualIndex = virtualItems[virtualItems.length - 1]?.index;

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || lastVirtualIndex === undefined) {
      return;
    }
    if (lastVirtualIndex >= rowCount - PREFETCH_ROW_BUFFER) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, lastVirtualIndex, rowCount, fetchNextPage]);

  const prevDimensionsRef = useRef({ width, columnCount });
  useLayoutEffect(() => {
    const prev = prevDimensionsRef.current;
    if (prev.width !== width || prev.columnCount !== columnCount) {
      prevDimensionsRef.current = { width, columnCount };
      rowVirtualizer.measure();
    }
  }, [width, columnCount, rowVirtualizer]);

  useLayoutEffect(() => {
    if (!restoreState) return;
    if (
      restoreState.scrollY > 0 &&
      Math.abs(window.scrollY - restoreState.scrollY) > 1
    ) {
      window.scrollTo({ top: restoreState.scrollY, behavior: "instant" });
    }
    onSettled?.();
  }, [restoreState, onSettled]);

  // Confirm restored scroll offset after frame commit in case browser native
  // history scroll restoration tried to override it asynchronously.
  useEffect(() => {
    if (!restoreState || restoreState.scrollY <= 0) return;
    const targetY = restoreState.scrollY;
    const rafId = window.requestAnimationFrame(() => {
      if (Math.abs(window.scrollY - targetY) > 2) {
        window.scrollTo({ top: targetY, behavior: "instant" });
      }
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [restoreState]);

  const containerElRef = useRef<HTMLDivElement | null>(null);
  const latestScrollYRef = useRef(0);

  useEffect(() => {
    const mountedUrlKey = getCurrentUrlKey();
    latestScrollYRef.current = window.scrollY;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    const canReadLiveScroll = () =>
      !disposed &&
      Boolean(containerElRef.current?.isConnected) &&
      getCurrentUrlKey() === mountedUrlKey;

    const persistNow = () => {
      const scrollY = canReadLiveScroll()
        ? window.scrollY
        : latestScrollYRef.current;

      saveGridScrollState(scrollKey, {
        scrollY,
        width,
        columnCount,
        totalHeight: rowVirtualizer.getTotalSize(),
        snapshot: rowVirtualizer.takeSnapshot(),
        urlKey: mountedUrlKey,
      });
    };

    const syncScroll = () => {
      if (!canReadLiveScroll()) return;
      latestScrollYRef.current = window.scrollY;
    };

    const handleScroll = () => {
      if (!canReadLiveScroll()) return;
      latestScrollYRef.current = window.scrollY;
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(persistNow, SCROLL_SAVE_DEBOUNCE_MS);
    };

    const handlePageHide = () => persistNow();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pointerdown", syncScroll, {
      passive: true,
      capture: true,
    });
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      disposed = true;
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointerdown", syncScroll, { capture: true });
      window.removeEventListener("pagehide", handlePageHide);
      persistNow();
    };
  }, [width, columnCount, scrollKey, rowVirtualizer]);

  const attachContainer = useCallback(
    (node: HTMLDivElement | null) => {
      containerElRef.current = node;
      rowVirtualizer.containerRef(node);
    },
    [rowVirtualizer]
  );

  const measureRow = useCallback(
    (node: HTMLDivElement | null) => {
      rowVirtualizer.measureElement(node);
    },
    [rowVirtualizer]
  );

  return (
    <div ref={attachContainer} className="relative">
      {virtualItems.map((virtualRow) => {
        const start = virtualRow.index * columnCount;
        const rowItems = items.slice(start, start + columnCount);
        const isLastRow = virtualRow.index === rowCount - 1;
        return (
          <div
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={measureRow}
            className={`absolute left-0 top-0 w-full ${isLastRow ? "" : "pb-4"}`}
            style={{ contain: "layout style" }}
          >
            <div className={`grid gap-4 ${columnsClassName}`}>
              {rowItems.map((item) => (
                <div key={getKey(item)} className="min-w-0">
                  {renderItem(item)}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface VirtualizedGridBodyProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  getKey: (item: T) => string;
  columns: GridColumns;
  cardAspectRatio?: number;
  scrollKey: string;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

function VirtualizedGridBody<T>({
  items,
  renderItem,
  getKey,
  columns,
  cardAspectRatio,
  scrollKey,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  sentinelRef,
}: VirtualizedGridBodyProps<T>) {
  const [restoreState] = useState<SavedGridScrollState | null>(() =>
    peekPendingGridRestore(scrollKey)
  );
  const [restoreMinHeight, setRestoreMinHeight] = useState<number | undefined>(
    () => restoreState?.totalHeight
  );
  const [metrics, setMetrics] = useState<LayoutMetrics | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastSizeRef = useRef<{ width: number; columnCount: number } | null>(
    null
  );

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const measureContainer = (measuredWidth: number) => {
      const roundedWidth = Math.round(measuredWidth);
      const viewportWidth =
        typeof window !== "undefined" ? window.innerWidth : roundedWidth;
      const nextColumnCount = resolveColumnCount(viewportWidth, columns.counts);
      const prev = lastSizeRef.current;

      if (
        prev &&
        prev.width === roundedWidth &&
        prev.columnCount === nextColumnCount
      ) {
        return;
      }

      lastSizeRef.current = {
        width: roundedWidth,
        columnCount: nextColumnCount,
      };

      const nextScrollMargin = node.offsetTop;
      if (restoreState) {
        markGridRestoreConsumed(scrollKey);
        if (restoreState.scrollY > 0 && window.scrollY !== restoreState.scrollY) {
          window.scrollTo({ top: restoreState.scrollY, behavior: "instant" });
        }
      }

      setMetrics({
        width: roundedWidth,
        columnCount: nextColumnCount,
        scrollMargin: nextScrollMargin,
      });
    };

    measureContainer(node.getBoundingClientRect().width);

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      measureContainer(entry.contentRect.width);
    });
    observer.observe(node);

    return () => observer.disconnect();
  }, [columns.counts, restoreState, scrollKey]);

  const handleSettled = useCallback(() => {
    setRestoreMinHeight(undefined);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: restoreMinHeight,
        overflowAnchor: "none",
      }}
    >
      {metrics && (
        <VirtualizedRows
          items={items}
          renderItem={renderItem}
          getKey={getKey}
          columnsClassName={columns.className}
          width={metrics.width}
          columnCount={metrics.columnCount}
          scrollMargin={metrics.scrollMargin}
          cardAspectRatio={cardAspectRatio}
          scrollKey={scrollKey}
          restoreState={restoreState}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          onSettled={handleSettled}
        />
      )}
      {hasNextPage && (
        <div ref={sentinelRef} className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      )}
    </div>
  );
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
  cardAspectRatio,
  scrollKey,
}: InfiniteGridProps<T>) {
  const pathname = usePathname();
  const effectiveScrollKey = scrollKey ?? pathname;

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
    <VirtualizedGridBody
      key={effectiveScrollKey}
      items={items}
      renderItem={renderItem}
      getKey={getKey}
      columns={columns}
      cardAspectRatio={cardAspectRatio}
      scrollKey={effectiveScrollKey}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      sentinelRef={sentinelRef}
    />
  );
}
