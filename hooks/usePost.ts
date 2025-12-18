'use client';

import { useQuery } from '@tanstack/react-query';
import { getPostById } from '@/lib/api/posts.api';

/**
 * Custom hook to fetch a single Instagram post by ID
 */
export const usePost = (id: string) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostById(id),
    enabled: !!id,
  });
};
