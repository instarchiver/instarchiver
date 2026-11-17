"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react";
import { useStatistics } from "@/hooks/use-stats";
import { useRecentPosts } from "@/hooks/use-posts";
import { useRecentStories } from "@/hooks/use-stories";
import type { SiteStatistics } from "@/lib/api/types";
import { formatCount } from "@/lib/format";
import { PostCard } from "@/components/posts/post-card";
import { StoryCard } from "@/components/stories/story-card";
import { AdSlot } from "@/components/ads/ad-slot";
import { ErrorState } from "@/components/ui/error-state";
import { SearchInput } from "@/components/ui/search-input";
import { CardSkeletonGrid, Skeleton } from "@/components/ui/skeleton";
import { COLUMNS_2_3_4_5 } from "@/components/ui/grid-columns";

const RECENT_LIMIT = 20;

export function HomeSearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim().replace(/^@/, "");
    router.push(trimmed ? `/users?q=${encodeURIComponent(trimmed)}` : "/users");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
    >
      <div className="flex-1">
        <SearchInput
          value={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
          placeholder="Search by @username or name..."
          aria-label="Look up an Instagram user"
        />
      </div>
      <button
        type="submit"
        className="flex min-h-11 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-accent px-5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Find user
      </button>
    </form>
  );
}

export function StatCount({ statKey }: { statKey: keyof SiteStatistics }) {
  const { data, isLoading, isError } = useStatistics();

  if (isLoading) {
    return <Skeleton className="h-7 w-14 sm:h-8" />;
  }

  if (isError || !data) {
    return (
      <p
        className="text-xl font-semibold tabular-nums text-muted-foreground sm:text-2xl"
        title="Archive totals unavailable"
      >
        —
      </p>
    );
  }

  const raw = data[statKey];
  return (
    <p
      className="text-xl font-semibold tabular-nums text-foreground sm:text-2xl"
      title={raw.toLocaleString("en-US")}
    >
      {formatCount(raw)}
    </p>
  );
}

export function HomeStatsErrorNotice() {
  const { isError, refetch } = useStatistics();
  if (!isError) return null;

  return (
    <div
      role="alert"
      className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-dashed border-border bg-card px-4 py-2.5 text-sm"
    >
      <p className="text-muted-foreground">Couldn&apos;t load archive totals.</p>
      <button
        type="button"
        onClick={() => void refetch()}
        className="flex min-h-11 cursor-pointer items-center rounded-lg px-3 text-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Try again
      </button>
    </div>
  );
}

function RecentSection({
  title,
  href,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  skeletonAspectClass,
  children,
}: {
  title: string;
  href: string;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  onRetry: () => void;
  skeletonAspectClass: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <Link
          href={href}
          className="flex min-h-11 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg px-1 text-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          View all <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      {isLoading ? (
        <div className="mt-6">
          <CardSkeletonGrid
            count={10}
            columns={COLUMNS_2_3_4_5}
            aspectClass={skeletonAspectClass}
            showFooter={false}
          />
        </div>
      ) : isError ? (
        <div className="mt-6">
          <ErrorState message={errorMessage} onRetry={onRetry} />
        </div>
      ) : (
        <div className={`mt-6 grid gap-4 ${COLUMNS_2_3_4_5.className}`}>
          {children}
        </div>
      )}
    </section>
  );
}

export function RecentStories() {
  const { data, isLoading, isError, refetch } = useRecentStories();
  const stories = data?.results.slice(0, RECENT_LIMIT) ?? [];

  if (!isLoading && !isError && stories.length === 0) return null;

  return (
    <RecentSection
      title="Recently archived stories"
      href="/stories"
      isLoading={isLoading}
      isError={isError}
      errorMessage="Couldn't load recently archived stories."
      onRetry={() => void refetch()}
      skeletonAspectClass="aspect-[9/16]"
    >
      {stories.map((story) => (
        <StoryCard key={story.story_id} story={story} />
      ))}
    </RecentSection>
  );
}

export function RecentPosts() {
  const { data, isLoading, isError, refetch } = useRecentPosts();
  const posts = data?.results.slice(0, RECENT_LIMIT) ?? [];

  if (!isLoading && !isError && posts.length === 0) return null;

  return (
    <RecentSection
      title="Recently archived posts"
      href="/posts"
      isLoading={isLoading}
      isError={isError}
      errorMessage="Couldn't load recently archived posts."
      onRetry={() => void refetch()}
      skeletonAspectClass="aspect-square"
    >
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </RecentSection>
  );
}

export function HomeMidAdSlot() {
  const stories = useRecentStories();
  const posts = useRecentPosts();
  const hasBothSections =
    !stories.isLoading &&
    !posts.isLoading &&
    !stories.isError &&
    !posts.isError &&
    (stories.data?.results.length ?? 0) > 0 &&
    (posts.data?.results.length ?? 0) > 0;

  return <AdSlot variant="leaderboard" className="mt-10" enabled={hasBothSections} />;
}
