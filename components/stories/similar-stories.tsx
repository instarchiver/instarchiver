"use client";

import { useCallback, useMemo } from "react";
import { CirclesFour } from "@phosphor-icons/react";
import { useSimilarStories } from "@/hooks/use-stories";
import { InfiniteGrid } from "@/components/ui/infinite-grid";
import { COLUMNS_2_3_4_5 } from "@/components/ui/grid-columns";
import type { Story } from "@/lib/api/types";
import { StoryCard } from "./story-card";

export function SimilarStories({ storyId }: { storyId: string }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useSimilarStories(storyId);

  const stories = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data?.pages]
  );
  const getKey = useCallback((story: Story) => story.story_id, []);
  const renderItem = useCallback(
    (story: Story) => <StoryCard story={story} />,
    []
  );
  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-foreground">Similar stories</h2>
      <div className="mt-4">
        <InfiniteGrid
          items={stories}
          getKey={getKey}
          renderItem={renderItem}
          hasNextPage={Boolean(hasNextPage)}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          isLoading={isLoading}
          isError={isError}
          onRetry={handleRetry}
          emptyIcon={CirclesFour}
          emptyTitle="No similar stories found"
          columns={COLUMNS_2_3_4_5}
          cardAspectRatio={9 / 16}
          scrollKey={`similar:story:${storyId}`}
        />
      </div>
    </div>
  );
}
