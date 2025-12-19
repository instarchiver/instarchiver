'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchSimilarPosts, extractPageNumber } from '@/lib/api/posts.api';

/**
 * Custom hook to fetch similar Instagram posts by post ID with infinite scroll support
 * Uses page number pagination (DRF PageNumberPagination)
 */
export const useSimilarPosts = (id: string) => {
  return useInfiniteQuery({
    queryKey: ['similar-posts', id],
    queryFn: ({ pageParam }: { pageParam: number | undefined }) =>
      fetchSimilarPosts({ id, pageParam }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: lastPage => extractPageNumber(lastPage.next),
    getPreviousPageParam: firstPage => extractPageNumber(firstPage.previous),
    enabled: !!id,
  });
};
