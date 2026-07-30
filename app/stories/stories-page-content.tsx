"use client";

import { CirclesFour } from "@phosphor-icons/react";
import { useInfiniteStories } from "@/hooks/use-stories";
import { InfiniteGrid } from "@/components/ui/infinite-grid";
import { StoryCard } from "@/components/stories/story-card";

export function StoriesPageContent() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteStories();

  const stories = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground">Stories</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every archived story, from every user.
      </p>

      <div className="mt-8">
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
          emptyTitle="No stories archived yet"
          columnsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        />
      </div>
    </div>
  );
}
