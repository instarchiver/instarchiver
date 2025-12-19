import axiosInstance from '@/lib/axios';
import { InstagramPost } from '@/app/types/instagram';

/**
 * Fetch a single Instagram post by ID
 */
export const getPostById = async (id: string): Promise<InstagramPost> => {
  const response = await axiosInstance.get<InstagramPost>(`/instagram/posts/${id}/`);
  return response.data;
};

/**
 * Fetch similar posts for a given post ID
 */
export const getSimilarPosts = async (id: string): Promise<InstagramPost[]> => {
  const response = await axiosInstance.get<{ results: InstagramPost[] }>(
    `/instagram/posts/${id}/similar/`
  );
  return response.data.results;
};
