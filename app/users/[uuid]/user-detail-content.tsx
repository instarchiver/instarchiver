"use client";

import { Suspense, useCallback, useMemo, useRef, type KeyboardEvent } from "react";
import Link from "next/link";
import { CirclesFour, GridFour, UsersThree } from "@phosphor-icons/react";
import { useSearchParamState } from "@/components/hooks/use-search-param-state";
import { useUser } from "@/hooks/use-users";
import { useInfinitePosts } from "@/hooks/use-posts";
import { useInfiniteStories } from "@/hooks/use-stories";
import { ApiError } from "@/lib/api/client";
import { UserProfileHeader } from "@/components/users/user-profile-header";
import { AdSlot } from "@/components/ads/ad-slot";
import { InfiniteGrid } from "@/components/ui/infinite-grid";
import { COLUMNS_2_3_4_5, COLUMNS_3_4_5 } from "@/components/ui/grid-columns";
import { PostCard } from "@/components/posts/post-card";
import { StoryCard } from "@/components/stories/story-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { CardSkeletonGrid, Skeleton } from "@/components/ui/skeleton";
import type { Post, Story } from "@/lib/api/types";

type Tab = "posts" | "stories";

const TABS = [
  { id: "posts", label: "Posts", icon: GridFour },
  { id: "stories", label: "Stories", icon: CirclesFour },
] as const;

export function UserDetailFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <Skeleton className="h-24 w-24 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-28" />
          <div className="flex gap-6">
            <Skeleton className="h-10 w-12" />
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-10 w-16" />
          </div>
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="mt-10 flex gap-2 border-b border-border pb-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="mt-6">
        <CardSkeletonGrid count={10} columns={COLUMNS_2_3_4_5} showFooter={false} />
      </div>
    </div>
  );
}

function UserPostsPanel({
  uuid,
  isPrivate,
}: {
  uuid: string;
  isPrivate: boolean;
}) {
  const postsQuery = useInfinitePosts(uuid);
  const posts = useMemo(
    () => postsQuery.data?.pages.flatMap((p) => p.results) ?? [],
    [postsQuery.data?.pages]
  );

  const getPostKey = useCallback((post: Post) => post.id, []);
  const renderPostItem = useCallback((post: Post) => <PostCard post={post} />, []);
  const handleRetryPosts = useCallback(() => {
    void postsQuery.refetch();
  }, [postsQuery]);

  return (
    <InfiniteGrid
      items={posts}
      getKey={getPostKey}
      renderItem={renderPostItem}
      hasNextPage={Boolean(postsQuery.hasNextPage)}
      isFetchingNextPage={postsQuery.isFetchingNextPage}
      fetchNextPage={postsQuery.fetchNextPage}
      isLoading={postsQuery.isLoading}
      isError={postsQuery.isError}
      onRetry={handleRetryPosts}
      emptyIcon={GridFour}
      emptyTitle="No posts from this user yet"
      emptyDescription={
        isPrivate
          ? "This account is private, so only posts archived while it was public can appear here."
          : undefined
      }
      errorMessage="Couldn't load this user's posts."
      columns={COLUMNS_2_3_4_5}
      cardAspectRatio={1}
      showSkeletonFooter={false}
      scrollKey={`user:${uuid}:posts`}
    />
  );
}

function UserStoriesPanel({
  uuid,
  isPrivate,
  hasStories,
}: {
  uuid: string;
  isPrivate: boolean;
  hasStories: boolean;
}) {
  const storiesQuery = useInfiniteStories(uuid);
  const stories = useMemo(
    () => storiesQuery.data?.pages.flatMap((p) => p.results) ?? [],
    [storiesQuery.data?.pages]
  );

  const getStoryKey = useCallback((story: Story) => story.story_id, []);
  const renderStoryItem = useCallback(
    (story: Story) => <StoryCard story={story} />,
    []
  );
  const handleRetryStories = useCallback(() => {
    void storiesQuery.refetch();
  }, [storiesQuery]);

  const emptyDescription = isPrivate
    ? "This account is private, so only stories archived while it was public can appear here."
    : !hasStories
      ? "No stories have been captured for this profile yet."
      : undefined;

  return (
    <InfiniteGrid
      items={stories}
      getKey={getStoryKey}
      renderItem={renderStoryItem}
      hasNextPage={Boolean(storiesQuery.hasNextPage)}
      isFetchingNextPage={storiesQuery.isFetchingNextPage}
      fetchNextPage={storiesQuery.fetchNextPage}
      isLoading={storiesQuery.isLoading}
      isError={storiesQuery.isError}
      onRetry={handleRetryStories}
      emptyIcon={CirclesFour}
      emptyTitle="No stories from this user yet"
      emptyDescription={emptyDescription}
      errorMessage="Couldn't load this user's stories."
      columns={COLUMNS_3_4_5}
      cardAspectRatio={9 / 16}
      showSkeletonFooter={false}
      scrollKey={`user:${uuid}:stories`}
    />
  );
}

function UserDetail({ uuid }: { uuid: string }) {
  const { value: tabParam, setValue: setTab } = useSearchParamState(
    "tab",
    "posts"
  );
  const tab: Tab = tabParam === "stories" ? "stories" : "posts";
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useUser(uuid);

  function handleTabKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % TABS.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + TABS.length) % TABS.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = TABS.length - 1;
    }

    if (nextIndex === null) return;
    e.preventDefault();
    const nextTab = TABS[nextIndex];
    setTab(nextTab.id);
    tabRefs.current[nextIndex]?.focus();
  }

  if (isLoading) return <UserDetailFallback />;

  if (isError && error instanceof ApiError && error.status === 404) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
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

  if (isError || !user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <ErrorState
          message="Couldn't load this user."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <UserProfileHeader user={user} />

      <div className="mt-1 flex justify-center sm:justify-start">
        <Link
          href="/dmca"
          className="inline-flex min-h-11 items-center rounded-sm text-xs text-muted-foreground transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Request profile or content removal
        </Link>
      </div>

      <AdSlot variant="leaderboard" className="mt-6" enabled={Boolean(user)} />

      <div
        role="tablist"
        aria-label="Profile content"
        className="mt-8 flex gap-1 border-b border-border"
      >
        {TABS.map(({ id, label, icon: Icon }, index) => {
          const selected = tab === id;
          return (
            <button
              key={id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={`tab-${id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(id)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
              className={`flex min-h-11 cursor-pointer items-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                selected
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>

      <div
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        className="mt-6"
      >
        {tab === "posts" ? (
          <UserPostsPanel uuid={uuid} isPrivate={user.is_private} />
        ) : (
          <UserStoriesPanel
            uuid={uuid}
            isPrivate={user.is_private}
            hasStories={user.has_stories}
          />
        )}
      </div>
    </div>
  );
}

export function UserDetailContent({ uuid }: { uuid: string }) {
  return (
    <Suspense fallback={<UserDetailFallback />}>
      <UserDetail uuid={uuid} />
    </Suspense>
  );
}
