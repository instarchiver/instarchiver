"use client";

import { useCallback, useMemo } from "react";
import { GridFour } from "@phosphor-icons/react";
import { useSimilarPosts } from "@/hooks/use-posts";
import { InfiniteGrid } from "@/components/ui/infinite-grid";
import { COLUMNS_2_3_4_5 } from "@/components/ui/grid-columns";
import type { Post } from "@/lib/api/types";
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

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data?.pages]
  );
  const getKey = useCallback((post: Post) => post.id, []);
  const renderItem = useCallback((post: Post) => <PostCard post={post} />, []);
  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-foreground">Similar posts</h2>
      <div className="mt-4">
        <InfiniteGrid
          items={posts}
          getKey={getKey}
          renderItem={renderItem}
          hasNextPage={Boolean(hasNextPage)}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          isLoading={isLoading}
          isError={isError}
          onRetry={handleRetry}
          emptyIcon={GridFour}
          emptyTitle="No similar posts found"
          columns={COLUMNS_2_3_4_5}
          cardAspectRatio={1}
          scrollKey={`similar:post:${postId}`}
        />
      </div>
    </div>
  );
}
