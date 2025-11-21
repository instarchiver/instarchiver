import axiosInstance from '@/lib/axios';
import { InstagramStory, InstagramStoriesResponse } from '@/app/types/instagram/story';
import { AxiosError } from 'axios';

// Constants
export const API_CONSTANTS = {
  COUNT_PER_PAGE: 12,
};

// Ordering options for stories
export const ORDERING_OPTIONS = {
  NEWEST_FIRST: '-story_created_at',
  OLDEST_FIRST: 'story_created_at',
  UPLOAD_NEWEST: '-created_at',
  UPLOAD_OLDEST: 'created_at',
} as const;

export type OrderingOption = (typeof ORDERING_OPTIONS)[keyof typeof ORDERING_OPTIONS];

// Query options interface
export interface StoriesQueryOptions {
  cursor?: string | null;
  searchQuery?: string;
  userId?: string;
  ordering?: OrderingOption | string;
  dateFrom?: string;
  dateTo?: string;
}

// API error class
export class APIError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Extract cursor from pagination URL
 */
export function extractCursor(url: string | null): string | null {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('cursor');
  } catch {
    return null;
  }
}

/**
 * Fetch stories with comprehensive options using cursor pagination
 */
export async function fetchStoriesWithOptions(
  options: StoriesQueryOptions = {}
): Promise<InstagramStoriesResponse> {
  const { cursor, searchQuery, userId, ordering, dateFrom, dateTo } = options;

  try {
    const params: Record<string, string> = {
      page_size: API_CONSTANTS.COUNT_PER_PAGE.toString(),
    };

    // Add cursor if provided
    if (cursor) params.cursor = cursor;

    // Add optional parameters
    if (searchQuery) params.user__username = searchQuery;
    if (userId) params.user = userId;
    if (ordering) params.ordering = ordering;
    if (dateFrom) params.story_created_at__gte = dateFrom;
    if (dateTo) params.story_created_at__lte = dateTo;

    const response = await axiosInstance.get<InstagramStoriesResponse>('/instagram/stories/', {
      params,
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.message || 'Failed to fetch stories'
      );
    }
    throw new Error('Failed to fetch data from API');
  }
}

/**
 * Fetch stories with optional filtering - Legacy function for backward compatibility
 */
export async function fetchStories(
  cursor?: string | null,
  searchQuery?: string,
  userId?: string
): Promise<InstagramStoriesResponse> {
  return fetchStoriesWithOptions({
    cursor,
    searchQuery,
    userId,
  });
}

/**
 * Fetch a single story by ID
 */
export async function fetchStoryById(storyId: string): Promise<InstagramStory> {
  try {
    const response = await axiosInstance.get<InstagramStory>(`/instagram/stories/${storyId}/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.message || 'Failed to fetch story'
      );
    }
    throw new Error('Failed to fetch story from API');
  }
}

/**
 * Download a story media to the user's device
 */
export async function downloadStoryMedia(story: InstagramStory): Promise<void> {
  try {
    const fileExtension = story.media.split('.').pop() || 'jpg';
    const fileName = `story_${story.story_id}.${fileExtension}`;

    // Create a temporary anchor element for downloading the file
    const link = document.createElement('a');
    link.href = story.media;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading story media:', error);
    throw new Error('Failed to download story media');
  }
}
