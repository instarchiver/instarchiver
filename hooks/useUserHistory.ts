'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUserHistory } from '@/app/users/[uuid]/services/history';

/**
 * Hook for fetching user history with cursor pagination
 */
export function useUserHistory(uuid: string, cursor?: string | null) {
  return useQuery({
    queryKey: ['userHistory', uuid, cursor],
    queryFn: () => fetchUserHistory(uuid, cursor),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!uuid,
  });
}
