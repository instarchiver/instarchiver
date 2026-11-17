"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ClockCounterClockwise, UsersThree } from "@phosphor-icons/react";
import { useInfiniteUserHistory, useUser } from "@/hooks/use-users";
import { ApiError } from "@/lib/api/client";
import { formatDay } from "@/lib/format";
import { diffSnapshots } from "@/lib/history-diff";
import { AdSlot } from "@/components/ads/ad-slot";
import { Avatar } from "@/components/users/avatar";
import { HistoryTimeline } from "@/components/users/history/history-timeline";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";

export function TimelineSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full" />
          <Skeleton className="h-28 flex-1 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export function UserHistoryFallback() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Skeleton className="h-11 w-32" />
      <div className="mt-4 mb-8 flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <TimelineSkeleton />
    </div>
  );
}

export function UserHistoryContent({ uuid }: { uuid: string }) {
  const {
    data: user,
    isError: isUserError,
    error: userError,
  } = useUser(uuid);
  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteUserHistory(uuid);

  const entries = useMemo(
    () => data?.pages.flatMap((p) => p.results) ?? [],
    [data?.pages]
  );

  const summary = useMemo(() => {
    if (entries.length === 0) return null;
    let totalChanges = 0;
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const previous = entries[i + 1];
      if (previous) {
        const diffCount = diffSnapshots(entry, previous).length;
        totalChanges += diffCount > 0 ? diffCount : entry.history_type === "-" ? 1 : 0;
      } else if (entry.history_type === "-") {
        totalChanges += 1;
      }
    }
    const newestDate = formatDay(entries[0]?.history_date);
    const oldestDate = formatDay(entries[entries.length - 1]?.history_date);
    const span =
      oldestDate && newestDate && oldestDate !== newestDate
        ? `${oldestDate} – ${newestDate}`
        : newestDate || oldestDate || "—";

    return {
      snapshotsCount: entries.length,
      totalChanges,
      span,
    };
  }, [entries]);

  if (isUserError && userError instanceof ApiError && userError.status === 404) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <EmptyState
          icon={UsersThree}
          title="User not found"
          description="This archived profile doesn't exist or may have been removed."
          action={
            <Link
              href="/users"
              className="inline-flex min-h-11 items-center rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Browse users
            </Link>
          }
        />
      </div>
    );
  }

  let content: React.ReactNode;
  if (isLoading) {
    content = <TimelineSkeleton />;
  } else if (isError) {
    content = (
      <ErrorState
        message="Couldn't load this profile's history."
        onRetry={() => void refetch()}
      />
    );
  } else if (entries.length === 0) {
    content = (
      <EmptyState
        icon={ClockCounterClockwise}
        title="No profile history yet"
        description="Changes show up here once the archive has synced this profile more than once."
      />
    );
  } else {
    content = (
      <>
        {summary && (
          <section
            aria-label="History summary"
            className="mb-6 rounded-xl border border-border bg-card p-4"
          >
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-medium text-muted-foreground">
                  Snapshots recorded
                </dt>
                <dd className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">
                  {summary.snapshotsCount}
                  {hasNextPage ? "+" : ""}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">
                  Change events detected
                </dt>
                <dd className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">
                  {summary.totalChanges}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">
                  Date span covered
                </dt>
                <dd className="mt-0.5 text-sm font-medium tabular-nums text-foreground">
                  {summary.span}
                </dd>
              </div>
            </dl>
            <p className="mt-3 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
              Each timeline entry compares consecutive archived snapshots to
              highlight changes in handle, display name, bio, avatar,
              verification, privacy status, or follower counts.
            </p>
            <Link
              href="/dmca"
              className="mt-1 inline-flex min-h-11 items-center rounded-sm text-xs text-muted-foreground transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Request profile or history removal
            </Link>
          </section>
        )}

        <AdSlot
          variant="leaderboard"
          className="mb-8"
          enabled={entries.length > 0}
        />

        <HistoryTimeline
          entries={entries}
          hasNextPage={Boolean(hasNextPage)}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href={`/users/${uuid}`}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to profile
      </Link>

      <div className="mt-4 mb-8 flex items-center gap-4">
        {user ? (
          <Avatar src={user.profile_picture} alt="" size="md" />
        ) : isUserError ? (
          <Avatar src={null} alt="" size="md" />
        ) : (
          <Skeleton className="h-12 w-12 rounded-full" />
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-foreground">
            Profile history
          </h1>
          {user ? (
            <p className="truncate text-sm text-muted-foreground">
              @{user.username}
            </p>
          ) : isUserError ? (
            <p className="text-sm text-muted-foreground">
              Profile details unavailable
            </p>
          ) : (
            <Skeleton className="mt-1 h-4 w-32" />
          )}
        </div>
      </div>

      {content}
    </div>
  );
}
