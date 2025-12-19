import axiosInstance from '@/lib/axios';
import { InstagramPost } from '@/app/types/instagram';
import { ApiResponse } from '@/app/types/api';

/**
 * Extract cursor from pagination URL (for cursor-based pagination)
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
 * Extract page number from pagination URL (for page number pagination)
 */
const extractPageNumber = (url: string | null): number | null => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    const page = urlObj.searchParams.get('page');
    return page ? parseInt(page, 10) : null;
  } catch {
    return null;
  }
};

/**
 * Fetch a single Instagram post by ID
 */
export const getPostById = async (id: string): Promise<InstagramPost> => {
  const response = await axiosInstance.get<InstagramPost>(`/instagram/posts/${id}/`);
  return response.data;
};

/**
 * Fetch similar posts for a given post ID with page number pagination support
 */
export const fetchSimilarPosts = async ({
  id,
  pageParam,
}: {
  id: string;
  pageParam?: number;
}): Promise<ApiResponse<InstagramPost>> => {
  const params: Record<string, string | number> = {};

  // Add page number if provided
  if (pageParam) {
    params.page = pageParam;
  }

  const response = await axiosInstance.get<ApiResponse<InstagramPost>>(
    `/instagram/posts/${id}/similar/`,
    { params }
  );
  return response.data;
};

/**
 * Fetch similar posts for a given post ID (legacy - returns just results)
 * @deprecated Use fetchSimilarPosts for pagination support
 */
export const getSimilarPosts = async (id: string): Promise<InstagramPost[]> => {
  const response = await fetchSimilarPosts({ id });
  return response.results;
};

export { extractCursor, extractPageNumber };
