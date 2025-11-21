'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { UserHistoryList } from './components/UserHistoryList';
import { fetchUserHistory, extractCursor } from '../services/history';
import { useUserHistory } from '@/hooks/useUserHistory';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';

interface UserHistoryPageProps {
  params: Promise<{
    uuid: string;
  }>;
}

export default function UserHistoryPage({ params }: UserHistoryPageProps) {
  const resolvedParams = React.use(params);
  const { uuid } = resolvedParams;
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [cursor, setCursor] = useState<string | null>(null);

  // Fetch history data using the useUserHistory hook with cursor
  const { data, isLoading, error } = useUserHistory(uuid, cursor);

  // Initialize cursor from URL params on mount and when URL changes
  useEffect(() => {
    const urlCursor = searchParams.get('cursor');
    setCursor(urlCursor);
  }, [searchParams]);

  const historyRecords = data ? data.results : [];
  const nextCursor = data?.next ? extractCursor(data.next) : null;
  const previousCursor = data?.previous ? extractCursor(data.previous) : null;

  // Prefetch next page data for smoother pagination
  useEffect(() => {
    if (nextCursor) {
      queryClient.prefetchQuery({
        queryKey: ['userHistory', uuid, nextCursor],
        queryFn: () => fetchUserHistory(uuid, nextCursor),
      });
    }
  }, [data, queryClient, uuid, nextCursor]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (previousCursor) {
      setCursor(previousCursor);
      const params = new URLSearchParams();
      params.set('cursor', previousCursor);
      router.push(`/users/${uuid}/history?${params.toString()}`);
      scrollToTop();
    }
  };

  const handleNextPage = () => {
    if (nextCursor) {
      setCursor(nextCursor);
      const params = new URLSearchParams();
      params.set('cursor', nextCursor);
      router.push(`/users/${uuid}/history?${params.toString()}`);
      scrollToTop();
    }
  };

  const username = data?.results[0]?.username || 'Loading...';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile History</h1>
        <p className="text-muted-foreground">Showing history records for user ({username})</p>
      </div>

      <UserHistoryList
        historyRecords={historyRecords}
        isLoading={isLoading}
        error={error instanceof Error ? error : null}
      />

      {!isLoading && (previousCursor || nextCursor) && (
        <Pagination className="mt-12">
          <PaginationContent className="flex flex-wrap justify-center gap-1 sm:gap-2">
            <PaginationItem className="min-w-9 sm:min-w-10">
              <PaginationPrevious
                href="#"
                onClick={e => {
                  e.preventDefault();
                  if (previousCursor) handlePrevPage();
                }}
                aria-disabled={!previousCursor}
                className={`${!previousCursor ? 'opacity-50 pointer-events-none' : ''} px-2 sm:px-3`}
              />
            </PaginationItem>

            <PaginationItem className="min-w-9 sm:min-w-10">
              <PaginationNext
                href="#"
                onClick={e => {
                  e.preventDefault();
                  if (nextCursor) handleNextPage();
                }}
                aria-disabled={!nextCursor}
                className={`${!nextCursor ? 'opacity-50 pointer-events-none' : ''} px-2 sm:px-3`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
