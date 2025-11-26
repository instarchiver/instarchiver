import axiosInstance from '@/lib/axios';
import { InstagramUser, InstagramUsersResponse } from '@/app/types/instagram';
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

// Query options interface
export interface UsersQueryOptions {
  cursor?: string | null;
  searchQuery?: string;
  ordering?: string;
  filters?: Record<string, string | number | boolean>;
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
 * Fetch users with comprehensive options using cursor pagination
 */
export async function fetchUsersWithOptions(
  options: UsersQueryOptions = {}
): Promise<InstagramUsersResponse> {
  const { cursor, searchQuery, ordering, filters } = options;

  try {
    const params: Record<string, string> = {
      page_size: API_CONSTANTS.COUNT_PER_PAGE.toString(),
    };

    // Add cursor if provided
    if (cursor) params.cursor = cursor;

    // Add optional parameters
    if (searchQuery) params.search = searchQuery;
    if (ordering) params.ordering = ordering;

    // Add additional filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = value.toString();
        }
      });
    }

    const response = await axiosInstance.get<InstagramUsersResponse>('/instagram/users/', {
      params,
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
    throw new Error('Failed to fetch data from API');
  }
}

/**
 * Fetch users with optional filtering - Legacy function for backward compatibility
 */
export async function fetchUsers(
  cursor?: string | null,
  searchQuery?: string
): Promise<InstagramUsersResponse> {
  return fetchUsersWithOptions({
    cursor,
    searchQuery,
  });
}

/**
 * Fetch a single user by UUID
 */
export async function fetchUserById(uuid: string): Promise<InstagramUser> {
  try {
    const response = await axiosInstance.get<InstagramUser>(`/instagram/users/${uuid}/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.message || 'Failed to fetch user'
      );
    }
    throw new Error('Failed to fetch user from API');
  }
}

/**
 * Create a new Instagram user by username
 */
export async function createUser(username: string): Promise<InstagramUser> {
  try {
    const response = await axiosInstance.post<InstagramUser>('/instagram/users/', {
      username,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.username?.[0] ||
        error.response?.data?.detail ||
        'Failed to create user';
      throw new APIError(error.response?.status || 500, errorMessage);
    }
    throw new Error('Failed to create user');
  }
}
