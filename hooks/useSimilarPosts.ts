'use client';

import { useQuery } from '@tanstack/react-query';
import { getSimilarPosts } from '@/lib/api/posts.api';

/**
 * Custom hook to fetch similar Instagram posts by post ID
 */
export const useSimilarPosts = (id: string) => {
  return useQuery({
    queryKey: ['similar-posts', id],
    queryFn: () => getSimilarPosts(id),
    enabled: !!id,
  });
};
