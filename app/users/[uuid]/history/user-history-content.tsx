"use client";

import Link from "next/link";
import { ArrowLeft, ClockCounterClockwise } from "@phosphor-icons/react";
import { useInfiniteUserHistory, useUser } from "@/hooks/use-users";
import { Avatar } from "@/components/users/avatar";
import { HistoryTimeline } from "@/components/users/history/history-timeline";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";

function TimelineSkeleton() {
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

export function UserHistoryContent({ uuid }: { uuid: string }) {
  const { data: user } = useUser(uuid);
  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteUserHistory(uuid);

  const entries = data?.pages.flatMap((p) => p.results) ?? [];

  let content: React.ReactNode;
  if (isLoading) {
    content = <TimelineSkeleton />;
  } else if (isError) {
    content = (
      <ErrorState
        message="Couldn't load this profile's history."
        onRetry={() => refetch()}
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
      <HistoryTimeline
        entries={entries}
        hasNextPage={Boolean(hasNextPage)}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href={`/users/${uuid}`}
        className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to profile
      </Link>

      <div className="mt-4 mb-8 flex items-center gap-4">
        {user ? (
          <Avatar src={user.profile_picture} alt={user.username} size="md" />
        ) : (
          <Skeleton className="h-12 w-12 rounded-full" />
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-foreground">
            Profile history
          </h1>
          {user ? (
            <p className="truncate text-sm text-muted-foreground">
              @{user.username}
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
