'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchStoriesWithOptions } from '@/lib/api/stories.api';
import { InstagramStoriesResponse } from '@/app/types/instagram/story';

/**
 * Extract cursor from pagination URL
 */
const extractCursor = (url: string | null): string | null => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('cursor');
  } catch {
    return null;
  }
};

/**
 * Custom hook to fetch Instagram stories with infinite scroll support
 */
export const useInfiniteStories = (search?: string) => {
  return useInfiniteQuery({
    queryKey: ['stories', search],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      fetchStoriesWithOptions({ cursor: pageParam, searchQuery: search }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: InstagramStoriesResponse) => extractCursor(lastPage.next),
    getPreviousPageParam: (firstPage: InstagramStoriesResponse) =>
      extractCursor(firstPage.previous),
  });
};
