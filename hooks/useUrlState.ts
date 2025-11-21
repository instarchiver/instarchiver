'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export interface UrlParams {
  search?: string;
  page?: number;
  cursor?: string;
}

export function useUrlState() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get('search') || '';
  const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
  const currentCursor = searchParams.get('cursor') || undefined;

  const updateParams = useCallback(
    (newParams: UrlParams) => {
      const params = new URLSearchParams();

      // Handle search parameter
      const search = newParams.search !== undefined ? newParams.search : currentSearch;
      if (search) {
        params.set('search', search);
      }

      // Handle page parameter (for page-based pagination)
      // If search is present, don't add page parameter (always page 1)
      // If no search and page > 1, add page parameter
      const page = newParams.page !== undefined ? newParams.page : currentPage;
      if (!search && page > 1) {
        params.set('page', page.toString());
      }

      // Handle cursor parameter (for cursor-based pagination)
      // Only add cursor if explicitly provided and no search
      const cursor = newParams.cursor !== undefined ? newParams.cursor : currentCursor;
      if (!search && cursor) {
        params.set('cursor', cursor);
      }

      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      router.push(newUrl, { scroll: false });
    },
    [router, currentSearch, currentPage, currentCursor]
  );

  const resetParams = useCallback(() => {
    router.push(window.location.pathname);
  }, [router]);

  return {
    search: currentSearch,
    page: currentPage,
    cursor: currentCursor,
    updateParams,
    resetParams,
  };
}
