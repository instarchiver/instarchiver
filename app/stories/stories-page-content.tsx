"use client";

import { CirclesFour } from "@phosphor-icons/react";
import { useInfiniteStories } from "@/hooks/use-stories";
import { useDebouncedSearchParam } from "@/components/hooks/use-debounced-search-param";
import { InfiniteGrid } from "@/components/ui/infinite-grid";
import { COLUMNS_2_3_4_5 } from "@/components/ui/grid-columns";
import { SearchInput } from "@/components/ui/search-input";
import { StoryCard } from "@/components/stories/story-card";

export function StoriesPageContent() {
  const { value: search, debouncedValue: debouncedSearch, setValue: setSearch } =
    useDebouncedSearchParam("q");
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteStories(undefined, debouncedSearch);

  const stories = data?.pages.flatMap((page) => page.results) ?? [];
  const isSearching = debouncedSearch.trim().length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground">Stories</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every archived story, from every user.
      </p>

      <div className="mt-6 max-w-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          onClear={() => setSearch("")}
          placeholder="Search stories..."
          aria-label="Search stories"
        />
      </div>

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
          emptyTitle={
            isSearching ? "No stories match your search" : "No stories archived yet"
          }
          emptyDescription={
            isSearching
              ? `No results for "${debouncedSearch}". Try a different username.`
              : undefined
          }
          columns={COLUMNS_2_3_4_5}
        />
      </div>
    </div>
  );
}
