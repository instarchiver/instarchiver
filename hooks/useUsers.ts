'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchUsersWithOptions,
  fetchUserById,
  type UsersQueryOptions,
  API_CONSTANTS,
} from '@/lib/api/users.api';

// Re-export types and constants for backward compatibility
export { API_CONSTANTS };
export type { UsersQueryOptions };

/**
 * Legacy hook for backward compatibility - now uses cursor pagination
 */
export function useUsersQuery(cursor?: string | null, searchQuery?: string) {
  return useUsersQueryWithOptions({
    cursor,
    searchQuery,
  });
}

/**
 * Enhanced hook with full options support for fetching users
 */
export function useUsersQueryWithOptions(options: UsersQueryOptions = {}) {
  const { cursor, searchQuery, ordering, filters } = options;

  return useQuery({
    queryKey: ['users', cursor, searchQuery, ordering, filters],
    queryFn: async () => {
      console.log(`[API Call] Fetching users with options:`, options);
      const result = await fetchUsersWithOptions(options);
      return result;
    },
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    retry: 2, // Retry failed requests twice
  });
}

/**
 * Main hook for fetching users with cursor pagination
 */
export function useUsers(options: UsersQueryOptions = {}) {
  return useUsersQueryWithOptions(options);
}

/**
 * Hook for fetching a single user by UUID
 */
export function useUserById(uuid: string) {
  return useQuery({
    queryKey: ['user', uuid],
    queryFn: () => fetchUserById(uuid),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!uuid,
  });
}
