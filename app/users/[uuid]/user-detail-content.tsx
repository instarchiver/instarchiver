"use client";

import { Suspense } from "react";
import { CirclesFour, GridFour } from "@phosphor-icons/react";
import { useSearchParamState } from "@/components/hooks/use-search-param-state";
import { useUser } from "@/hooks/use-users";
import { useInfinitePosts } from "@/hooks/use-posts";
import { useInfiniteStories } from "@/hooks/use-stories";
import { UserProfileHeader } from "@/components/users/user-profile-header";
import { InfiniteGrid } from "@/components/ui/infinite-grid";
import { COLUMNS_2_3_4, COLUMNS_3_4_5 } from "@/components/ui/grid-columns";
import { PostCard } from "@/components/posts/post-card";
import { StoryCard } from "@/components/stories/story-card";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";

type Tab = "posts" | "stories";

const TABS = [
  { id: "posts", label: "Posts", icon: GridFour },
  { id: "stories", label: "Stories", icon: CirclesFour },
] as const;

function UserDetailFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    </div>
  );
}

function UserDetail({ uuid }: { uuid: string }) {
  const { value: tabParam, setValue: setTab } = useSearchParamState(
    "tab",
    "posts"
  );
  const tab: Tab = tabParam === "stories" ? "stories" : "posts";

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useUser(uuid);

  const postsQuery = useInfinitePosts(uuid);
  const storiesQuery = useInfiniteStories(uuid);

  if (isLoading) return <UserDetailFallback />;

  if (isError || !user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <ErrorState
          message="Couldn't load this user."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const posts = postsQuery.data?.pages.flatMap((p) => p.results) ?? [];
  const stories = storiesQuery.data?.pages.flatMap((p) => p.results) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <UserProfileHeader user={user} />

      <div role="tablist" className="mt-10 flex gap-1 border-b border-border">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`flex min-h-11 cursor-pointer items-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors ${
              tab === id
                ? "border-accent text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "posts" ? (
          <InfiniteGrid
            items={posts}
            getKey={(post) => post.id}
            renderItem={(post) => <PostCard post={post} />}
            hasNextPage={Boolean(postsQuery.hasNextPage)}
            isFetchingNextPage={postsQuery.isFetchingNextPage}
            fetchNextPage={postsQuery.fetchNextPage}
            isLoading={postsQuery.isLoading}
            isError={postsQuery.isError}
            onRetry={() => postsQuery.refetch()}
            emptyIcon={GridFour}
            emptyTitle="No posts from this user yet"
            columns={COLUMNS_2_3_4}
          />
        ) : (
          <InfiniteGrid
            items={stories}
            getKey={(story) => story.story_id}
            renderItem={(story) => <StoryCard story={story} />}
            hasNextPage={Boolean(storiesQuery.hasNextPage)}
            isFetchingNextPage={storiesQuery.isFetchingNextPage}
            fetchNextPage={storiesQuery.fetchNextPage}
            isLoading={storiesQuery.isLoading}
            isError={storiesQuery.isError}
            onRetry={() => storiesQuery.refetch()}
            emptyIcon={CirclesFour}
            emptyTitle="No stories from this user yet"
            columns={COLUMNS_3_4_5}
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
