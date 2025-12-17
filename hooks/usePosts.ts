'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/app/types/api';
import { InstagramPost } from '@/app/types/instagram';

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
 * Fetches Instagram posts from the API
 */
const fetchPosts = async ({
  pageParam,
  search,
}: {
  pageParam?: string;
  search?: string;
}): Promise<ApiResponse<InstagramPost>> => {
  const params: Record<string, string> = {};

  // Add cursor if provided
  if (pageParam) {
    params.cursor = pageParam;
  }

  // Add search if provided
  if (search) {
    params.search = search;
  }

  const response = await axiosInstance.get<ApiResponse<InstagramPost>>('/instagram/posts/', {
    params,
  });
  return response.data;
};

/**
 * Custom hook to fetch Instagram posts with infinite scroll support
 */
export const usePosts = (search?: string) => {
  return useInfiniteQuery({
    queryKey: ['posts', search],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      fetchPosts({ pageParam, search }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => extractCursor(lastPage.next),
    getPreviousPageParam: firstPage => extractCursor(firstPage.previous),
  });
};
