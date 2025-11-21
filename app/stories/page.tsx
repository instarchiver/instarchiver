'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StoriesGrid, StorySkeleton, StoryPage } from './components';
import { useStoriesQueryWithOptions } from '@/hooks/useStories';
import { useViewMode } from '@/hooks/useViewMode';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';

export default function StoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useViewMode();

  const [cursor, setCursor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Reset state when navigating away
  useEffect(() => {
    // Clean up function runs when component unmounts
    return () => {
      setSearchQuery('');
      setCursor(null);
    };
  }, []);

  // Initialize state from URL params on mount
  useEffect(() => {
    const search = searchParams.get('search');
    const urlCursor = searchParams.get('cursor');

    console.log(`[URL Effect] URL params - search: "${search}", cursor: "${urlCursor}"`);
    console.log(`[URL Effect] Current state - searchQuery: "${searchQuery}", cursor: ${cursor}`);

    if (search && search !== searchQuery) {
      console.log(`[URL Effect] Setting search query from URL: "${search}"`);
      setSearchQuery(search);
    }

    if (urlCursor !== cursor) {
      console.log(`[URL Effect] Setting cursor from URL: ${urlCursor}`);
      setCursor(urlCursor);
    }
  }, [searchParams, cursor, searchQuery]);

  const { data, isLoading } = useStoriesQueryWithOptions({
    cursor,
    searchQuery,
  });

  const stories = data ? data.results : [];
  const nextCursor = data?.next ? extractCursor(data.next) : null;
  const previousCursor = data?.previous ? extractCursor(data.previous) : null;

  console.log(
    `[Stories Render] isLoading: ${isLoading}, stories count: ${stories.length}, cursor: ${cursor}, searchQuery: "${searchQuery}"`
  );
  console.log(`[Stories Render] nextCursor: ${nextCursor}, previousCursor: ${previousCursor}`);

  /**
   * Extract cursor from URL
   */
  function extractCursor(url: string | null): string | null {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('cursor');
    } catch {
      return null;
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    console.log(`[handleSearch] Searching for: "${query}"`);
    setSearchQuery(query);
    setCursor(null); // Reset cursor when searching

    // Build URL with search
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());

    const url = params.toString() ? `/stories?${params.toString()}` : '/stories';
    router.push(url);
    scrollToTop();
  };

  const handlePrevPage = () => {
    if (previousCursor) {
      console.log(`[handlePrevPage] Moving to previous cursor: ${previousCursor}`);
      setCursor(previousCursor);

      // Build URL with current search and previous cursor
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      params.set('cursor', previousCursor);

      router.push(`/stories?${params.toString()}`);
      scrollToTop();
    }
  };

  const handleNextPage = () => {
    if (nextCursor) {
      console.log(`[handleNextPage] Moving to next cursor: ${nextCursor}`);
      setCursor(nextCursor);

      // Build URL with current search and next cursor
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      params.set('cursor', nextCursor);

      router.push(`/stories?${params.toString()}`);
      scrollToTop();
    }
  };

  return (
    <StoryPage
      totalStories={stories.length}
      currentPage={1} // Not used with cursor pagination, but kept for compatibility
      searchQuery={searchQuery}
      viewMode={viewMode}
      onSearch={handleSearch}
      onViewModeChange={setViewMode}
      storiesContent={
        isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-10">
            {[...Array(8)].map((_, index) => (
              <StorySkeleton key={index} />
            ))}
          </div>
        ) : (
          <StoriesGrid stories={stories} viewMode={viewMode} />
        )
      }
      pagination={
        !isLoading && (
          <Pagination className="mt-12">
            <PaginationContent className="flex flex-wrap justify-center gap-1 sm:gap-2">
              <PaginationItem className="min-w-9 sm:min-w-10">
                <PaginationPrevious
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    if (previousCursor) handlePrevPage();
                  }}
                  aria-disabled={!previousCursor}
                  className={`${!previousCursor ? 'opacity-50 pointer-events-none' : ''} px-2 sm:px-3`}
                />
              </PaginationItem>

              <PaginationItem className="min-w-9 sm:min-w-10">
                <PaginationNext
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    if (nextCursor) handleNextPage();
                  }}
                  aria-disabled={!nextCursor}
                  className={`${!nextCursor ? 'opacity-50 pointer-events-none' : ''} px-2 sm:px-3`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )
      }
    />
  );
}
