'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchPlans } from '@/lib/api/pricing.api';

export function usePlansQuery() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans,
    staleTime: 5 * 60 * 1000,
  });
}
