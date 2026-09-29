"use client";

import { useCallback, useMemo } from "react";
import { ClockCounterClockwise } from "@phosphor-icons/react";
import { useIntersectionObserver } from "@/components/hooks/use-intersection-observer";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import type { InstagramUserHistory } from "@/lib/api/types";
import { diffSnapshots } from "@/lib/history-diff";
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

  // Snapshots with no tracked changes are skipped. The last loaded entry is
  // held back while more pages exist, since its diff needs the next page.
  const visible = useMemo(
    () =>
      entries.flatMap((entry, i) => {
        const previous = entries[i + 1];
        if (!previous) {
          return hasNextPage ? [] : [{ entry, changes: [], isFirst: true }];
        }
        const changes = diffSnapshots(entry, previous);
        if (changes.length === 0 && entry.history_type === "~") return [];
        return [{ entry, changes, isFirst: false }];
      }),
    [entries, hasNextPage]
  );

  if (visible.length === 0 && !hasNextPage) {
    return (
      <EmptyState
        icon={ClockCounterClockwise}
        title="No profile changes recorded"
      />
    );
  }

  return (
    <div>
      <ol>
        {visible.map(({ entry, changes, isFirst }) => (
          <HistoryEntry
            key={entry.history_id}
            entry={entry}
            changes={changes}
            isFirst={isFirst}
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
