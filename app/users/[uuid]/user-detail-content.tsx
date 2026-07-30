"use client";

import { useState } from "react";
import { CirclesFour, GridFour } from "@phosphor-icons/react";
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

export function UserDetailContent({ uuid }: { uuid: string }) {
  const [tab, setTab] = useState<Tab>("posts");

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useUser(uuid);

  const postsQuery = useInfinitePosts(uuid);
  const storiesQuery = useInfiniteStories(uuid);

  if (isLoading) {
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

      <div className="mt-10 flex gap-1 border-b border-border">
        <button
          type="button"
          onClick={() => setTab("posts")}
          className={`flex min-h-11 cursor-pointer items-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors ${
            tab === "posts"
              ? "border-accent text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <GridFour size={18} />
          Posts
        </button>
        <button
          type="button"
          onClick={() => setTab("stories")}
          className={`flex min-h-11 cursor-pointer items-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors ${
            tab === "stories"
              ? "border-accent text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <CirclesFour size={18} />
          Stories
        </button>
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
