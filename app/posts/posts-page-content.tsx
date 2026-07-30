"use client";

import { GridFour } from "@phosphor-icons/react";
import { useInfinitePosts } from "@/hooks/use-posts";
import { InfiniteGrid } from "@/components/ui/infinite-grid";
import { COLUMNS_2_3_4_5 } from "@/components/ui/grid-columns";
import { PostCard } from "@/components/posts/post-card";

export function PostsPageContent() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfinitePosts();

  const posts = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground">Posts</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every archived post, from every user.
      </p>

      <div className="mt-8">
        <InfiniteGrid
          items={posts}
          getKey={(post) => post.id}
          renderItem={(post) => <PostCard post={post} />}
          hasNextPage={Boolean(hasNextPage)}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          emptyIcon={GridFour}
          emptyTitle="No posts archived yet"
          columns={COLUMNS_2_3_4_5}
        />
      </div>
    </div>
  );
}
