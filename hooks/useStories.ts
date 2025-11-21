'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { InstagramStory } from '@/app/types/instagram/story';
import {
  fetchStoriesWithOptions,
  fetchStoryById,
  downloadStoryMedia,
  type StoriesQueryOptions,
  type OrderingOption,
  ORDERING_OPTIONS,
  API_CONSTANTS,
} from '@/lib/api/stories.api';

// Re-export types and constants for backward compatibility
export { ORDERING_OPTIONS, API_CONSTANTS };
export type { StoriesQueryOptions, OrderingOption };

/**
 * Legacy hook for backward compatibility - uses cursor pagination
 */
export function useStoriesQuery(cursor?: string | null, searchQuery?: string, userId?: string) {
  return useStoriesQueryWithOptions({
    cursor,
    searchQuery,
    userId,
  });
}

/**
 * Enhanced hook with full options support for fetching stories
 */
export function useStoriesQueryWithOptions(options: StoriesQueryOptions = {}) {
  const { cursor, searchQuery, userId, ordering, dateFrom, dateTo } = options;

  return useQuery({
    queryKey: ['stories', cursor, searchQuery, userId, ordering, dateFrom, dateTo],
    queryFn: async () => {
      console.log(`[API Call] Fetching stories with options:`, options);
      const result = await fetchStoriesWithOptions(options);
      console.log(
        `[API Response] Received ${result.results.length} stories, next: ${result.next}, previous: ${result.previous}`
      );
      return result;
    },
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    retry: 2, // Retry failed requests twice
  });
}

/**
 * Hook for fetching a single story by ID
 */
export function useStoryByIdQuery(storyId: string) {
  return useQuery({
    queryKey: ['story', storyId],
    queryFn: () => fetchStoryById(storyId),
    staleTime: 5 * 60 * 1000,
    enabled: !!storyId, // Only run query if storyId is provided
  });
}

/**
 * Hook for downloading story media
 */
export function useDownloadStoryMedia() {
  return useMutation({
    mutationFn: (story: InstagramStory) => downloadStoryMedia(story),
    onSuccess: () => {
      toast.success('Story downloaded successfully!');
    },
    onError: error => {
      toast.error('Failed to download story');
      console.error('Download error:', error);
    },
  });
}
