"use client";

import { useCallback, useMemo } from "react";
import { ArrowClockwise, CirclesFour } from "@phosphor-icons/react";
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
    () =>
      data?.pages
        .flatMap((page) => page.results)
        .filter((story) => story.story_id !== storyId) ?? [],
    [data?.pages, storyId]
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
    <section aria-labelledby="similar-stories-heading" className="mt-10">
      <h2
        id="similar-stories-heading"
        className="text-lg font-semibold text-foreground"
      >
        Similar stories
      </h2>
      <div className="mt-4">
        {!isLoading && isError && stories.length === 0 ? (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-card px-4 py-3 text-sm"
          >
            <p className="text-muted-foreground">
              Couldn&apos;t load similar stories.
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <ArrowClockwise size={16} aria-hidden="true" />
              Try again
            </button>
          </div>
        ) : !isLoading && !isError && stories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No similar stories in the archive yet.
          </p>
        ) : (
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
            errorMessage="Couldn't load more similar stories."
            showSkeletonFooter={false}
            columns={COLUMNS_2_3_4_5}
            cardAspectRatio={9 / 16}
            scrollKey={`similar:story:${storyId}`}
          />
        )}
      </div>
    </section>
  );
}
