'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { StoriesGrid, StorySkeleton, StoryPage } from './components';
import { useStoriesQueryWithOptions } from '@/hooks/useStories';
import { extractCursor, fetchStoriesWithOptions } from '@/lib/api/stories.api';
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
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useViewMode();

  const [cursor, setCursor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useStoriesQueryWithOptions({
    cursor,
    searchQuery,
  });

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

    if (search && search !== searchQuery) {
      setSearchQuery(search);
    }

    if (urlCursor !== cursor) {
      setCursor(urlCursor);
    }
  }, [searchParams, cursor, searchQuery]);

  const stories = data ? data.results : [];
  const nextCursor = data?.next ? extractCursor(data.next) : null;
  const previousCursor = data?.previous ? extractCursor(data.previous) : null;

  // Prefetch next page automatically when data is available
  useEffect(() => {
    if (nextCursor) {
      queryClient.prefetchQuery({
        queryKey: ['stories', nextCursor, searchQuery, undefined, undefined, undefined, undefined],
        queryFn: () => fetchStoriesWithOptions({ cursor: nextCursor, searchQuery }),
      });
    }
  }, [data, queryClient, searchQuery, nextCursor]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
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
