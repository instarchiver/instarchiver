'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { extractCursor, API_CONSTANTS } from '@/lib/api/users.api';
import { useUsers } from '@/hooks/useUsers';
import { useUrlState } from '@/hooks/useUrlState';

const { COUNT_PER_PAGE } = API_CONSTANTS;

// Import components from the components directory
import { UserSkeleton, UsersList, PaginationControls, InstagramPage } from './components';

// Main Instagram Users page component
export default function InstagramUsersList() {
  const queryClient = useQueryClient();
  const { search: searchQuery, cursor: currentCursor, updateParams, resetParams } = useUrlState();
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed');

  const { data, isLoading, error } = useUsers({
    cursor: searchQuery ? null : currentCursor,
    searchQuery,
  });

  useEffect(() => {
    if (data?.next && !searchQuery) {
      const nextCursor = extractCursor(data.next);
      if (nextCursor) {
        queryClient.prefetchQuery({
          queryKey: ['users', nextCursor, searchQuery, undefined, undefined],
          queryFn: () =>
            import('@/lib/api/users.api').then(mod =>
              mod.fetchUsersWithOptions({ cursor: nextCursor, searchQuery })
            ),
        });
      }
    }
  }, [data, queryClient, searchQuery]);

  const handleNextPage = (): void => {
    if (data?.next && !searchQuery) {
      const nextCursor = extractCursor(data.next);
      if (nextCursor) {
        updateParams({ cursor: nextCursor });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevPage = (): void => {
    if (data?.previous && !searchQuery) {
      const prevCursor = extractCursor(data.previous);
      // If there's no previous cursor, it means we're going back to the first page
      updateParams({ cursor: prevCursor || undefined });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRetry = () => {
    resetParams();
  };

  return (
    <InstagramPage
      totalCount={data?.count || 0}
      currentPage={1} // Not used with cursor pagination, but kept for compatibility
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      usersList={
        <Suspense
          fallback={
            <div
              className={
                viewMode === 'compact'
                  ? 'space-y-3'
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              }
            >
              {[...Array(COUNT_PER_PAGE)].map((_, index) => (
                <UserSkeleton key={`skeleton-${index}`} index={index} variant={viewMode} />
              ))}
            </div>
          }
        >
          <UsersList
            users={data?.results || []}
            isLoading={isLoading}
            error={error instanceof Error ? error : null}
            count={COUNT_PER_PAGE}
            onRetry={handleRetry}
            searchQuery={searchQuery}
            viewMode={viewMode}
          />
        </Suspense>
      }
      pagination={
        <Suspense
          fallback={
            <div className="mt-12 flex justify-center">
              <div className="bg-gray-200 border-4 border-black h-12 w-64 animate-pulse"></div>
            </div>
          }
        >
          {!isLoading && data && !searchQuery && (
            <PaginationControls
              hasPrevious={!!data.previous}
              hasNext={!!data.next}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
            />
          )}
        </Suspense>
      }
    />
  );
}
