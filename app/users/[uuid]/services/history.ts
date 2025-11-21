import axiosInstance from '@/lib/axios';
import { InstagramUserHistoryResponse } from '@/app/types/instagram/history';
import { AxiosError } from 'axios';

// Constants
export const API_CONSTANTS = {
  COUNT_PER_PAGE: 12,
};

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
 * Fetch history records for an Instagram user with cursor pagination
 */
export async function fetchUserHistory(
  uuid: string,
  cursor?: string | null
): Promise<InstagramUserHistoryResponse> {
  try {
    const params: Record<string, string> = {
      page_size: API_CONSTANTS.COUNT_PER_PAGE.toString(),
    };

    if (cursor) params.cursor = cursor;

    const response = await axiosInstance.get<InstagramUserHistoryResponse>(
      `/instagram/users/${uuid}/history/`,
      { params }
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.message || 'Failed to fetch user history'
      );
    }
    throw new Error('Failed to fetch user history from API');
  }
}
