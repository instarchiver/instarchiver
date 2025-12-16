'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/app/types/api';
import { InstagramPost } from '@/app/types/instagram';

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
  let url = pageParam || '/instagram/posts/';

  // If no pageParam but search exists, add search to initial URL
  if (!pageParam && search) {
    url = `/instagram/posts/?search=${encodeURIComponent(search)}`;
  }

  const response = await axiosInstance.get<ApiResponse<InstagramPost>>(url);
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
    getNextPageParam: lastPage => lastPage.next,
    getPreviousPageParam: firstPage => firstPage.previous,
  });
};
