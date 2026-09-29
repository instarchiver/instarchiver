"use client";

import { useCallback } from "react";
import { useIntersectionObserver } from "@/components/hooks/use-intersection-observer";
import { Spinner } from "@/components/ui/spinner";
import type { InstagramUserHistory } from "@/lib/api/types";
import { HistoryEntry } from "./history-entry";

export function HistoryTimeline({
  entries,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: {
  entries: InstagramUserHistory[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}) {
  const onIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useIntersectionObserver(onIntersect, hasNextPage);

  return (
    <div>
      <ol>
        {entries.map((entry, i) => (
          <HistoryEntry
            key={entry.history_id}
            entry={entry}
            previous={entries[i + 1]}
            isOldest={!hasNextPage && i === entries.length - 1}
          />
        ))}
      </ol>
      {hasNextPage && (
        <div ref={sentinelRef} className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      )}
    </div>
  );
}
