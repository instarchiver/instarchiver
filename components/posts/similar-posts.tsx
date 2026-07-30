"use client";

import { GridFour } from "@phosphor-icons/react";
import { useSimilarPosts } from "@/hooks/use-posts";
import { InfiniteGrid } from "@/components/ui/infinite-grid";
import { COLUMNS_2_3_4_5 } from "@/components/ui/grid-columns";
import { PostCard } from "./post-card";

export function SimilarPosts({ postId }: { postId: string }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useSimilarPosts(postId);

  const posts = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-foreground">Similar Posts</h2>
      <div className="mt-4">
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
          emptyTitle="No similar posts found"
          columns={COLUMNS_2_3_4_5}
        />
      </div>
    </div>
  );
}
