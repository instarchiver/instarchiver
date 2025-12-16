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
}: {
  pageParam?: string;
}): Promise<ApiResponse<InstagramPost>> => {
  const url = pageParam || '/instagram/posts/';
  const response = await axiosInstance.get<ApiResponse<InstagramPost>>(url);
  return response.data;
};

/**
 * Custom hook to fetch Instagram posts with infinite scroll support
 */
export const usePosts = () => {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    initialPageParam: undefined,
    getNextPageParam: lastPage => lastPage.next,
    getPreviousPageParam: firstPage => firstPage.previous,
  });
};
