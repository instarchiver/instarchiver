"use client";

import { CirclesFour } from "@phosphor-icons/react";
import { useSimilarStories } from "@/hooks/use-stories";
import { InfiniteGrid } from "@/components/ui/infinite-grid";
import { COLUMNS_2_3_4_5 } from "@/components/ui/grid-columns";
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

  const stories = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-foreground">Similar Stories</h2>
      <div className="mt-4">
        <InfiniteGrid
          items={stories}
          getKey={(story) => story.story_id}
          renderItem={(story) => <StoryCard story={story} />}
          hasNextPage={Boolean(hasNextPage)}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          emptyIcon={CirclesFour}
          emptyTitle="No similar stories found"
          columns={COLUMNS_2_3_4_5}
        />
      </div>
    </div>
  );
}
