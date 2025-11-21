import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InstagramUserHistory } from '@/app/types/instagram/history';
import { formatNumber, formatDate } from '../../utils/formatters';
import { fetchUserHistory } from '../services/history';
import { neoBrutalistColors } from '../../utils/colors';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type HistoryChangeField = Extract<
  keyof InstagramUserHistory,
  | 'follower_count'
  | 'following_count'
  | 'media_count'
  | 'biography'
  | 'full_name'
  | 'is_private'
  | 'is_verified'
  | 'profile_picture'
>;

interface HistoryChange {
  field: HistoryChangeField;
  old: InstagramUserHistory[HistoryChangeField];
  new: InstagramUserHistory[HistoryChangeField];
}

interface UserHistoryGridProps {
  uuid: string;
}

export function UserHistoryGrid({ uuid }: UserHistoryGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCursor = searchParams.get('cursor');

  const { data, isLoading, error } = useQuery({
    queryKey: ['userHistory', uuid, currentCursor],
    queryFn: () => fetchUserHistory(uuid, currentCursor),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const handleNextPage = () => {
    if (data?.next) {
      const nextCursor = extractCursor(data.next);
      if (nextCursor) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('cursor', nextCursor);
        router.push(`${pathname}?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevPage = () => {
    if (data?.previous) {
      const prevCursor = extractCursor(data.previous);
      const params = new URLSearchParams(searchParams.toString());
      if (prevCursor) {
        params.set('cursor', prevCursor);
      } else {
        // Going back to first page
        params.delete('cursor');
      }
      router.push(`${pathname}?${params.toString()}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const extractCursor = (url: string | null): string | null => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('cursor');
    } catch {
      return null;
    }
  };

  if (error) {
    return (
      <Card className="shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
        <CardHeader className="border-b-2 border-black bg-red-400">
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-lg font-bold mb-4">Failed to load history</p>
          <Button onClick={() => window.location.reload()} className="font-black">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Function to calculate differences between consecutive history records
  const getChanges = (current: InstagramUserHistory, prev?: InstagramUserHistory) => {
    if (!prev) return null;

    const changes: HistoryChange[] = [];
    const fieldsToCheck: HistoryChangeField[] = [
      'follower_count',
      'following_count',
      'media_count',
      'biography',
      'full_name',
      'is_private',
      'is_verified',
      'profile_picture',
    ];

    fieldsToCheck.forEach(field => {
      if (current[field] !== prev[field]) {
        changes.push({
          field,
          old: prev[field],
          new: current[field],
        });
      }
    });

    return changes;
  };

  if (isLoading) {
    return (
      <Card className="shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
        <CardHeader className="border-b-2 border-black bg-yellow-200">
          <CardTitle>Profile History</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card
                key={i}
                className="border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] overflow-hidden"
              >
                <CardHeader
                  className={`border-b-2 border-black ${neoBrutalistColors.header[i % neoBrutalistColors.header.length]} p-4`}
                >
                  <div className="h-6 bg-gray-200 rounded-base border-2 border-black w-1/3 animate-pulse" />
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded-base border-2 border-black w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded-base border-2 border-black w-2/3 animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
      <CardHeader className="border-b-2 border-black bg-yellow-200">
        <CardTitle>Profile History</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {data?.results.map((record, index) => {
            const prevRecord = data.results[index + 1];
            const changes = getChanges(record, prevRecord);

            return (
              <Card
                key={record.history_id}
                className="border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] overflow-hidden"
              >
                <CardHeader
                  className={`border-b-2 border-black ${
                    neoBrutalistColors.header[index % neoBrutalistColors.header.length]
                  } py-3`}
                >
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-black">{formatDate(record.history_date)}</p>
                  </div>
                </CardHeader>
                <CardContent className={`p-4 ${neoBrutalistColors.bio}`}>
                  {changes && changes.length > 0 ? (
                    <ScrollArea className="h-auto max-h-[200px]">
                      <div className="space-y-3">
                        {changes.map((change, i) => (
                          <div key={i} className="border-2 border-black rounded-base p-3 bg-white">
                            <div className="flex flex-wrap gap-2 items-center">
                              <Badge variant="neutral" className="font-black">
                                {change.field.replace(/_/g, ' ').toUpperCase()}
                              </Badge>
                              <span className="font-medium">
                                {(() => {
                                  switch (change.field) {
                                    case 'follower_count':
                                    case 'following_count':
                                    case 'media_count':
                                      return (
                                        <span className="font-black">
                                          {formatNumber(change.old as number)} →{' '}
                                          {formatNumber(change.new as number)}
                                        </span>
                                      );
                                    case 'is_private':
                                    case 'is_verified':
                                      return (
                                        <span>
                                          {(change.old as boolean) ? 'Yes' : 'No'} →{' '}
                                          {(change.new as boolean) ? 'Yes' : 'No'}
                                        </span>
                                      );
                                    case 'profile_picture':
                                      return 'Changed profile picture';
                                    default:
                                      return (
                                        <span className="font-medium">
                                          {(change.old as string) || 'none'} →{' '}
                                          {(change.new as string) || 'none'}
                                        </span>
                                      );
                                  }
                                })()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : index === data.results.length - 1 ? (
                    <div className="border-2 border-black rounded-base p-3 bg-white">
                      <p className="text-sm font-medium text-gray-500 italic">Initial record</p>
                    </div>
                  ) : (
                    <div className="border-2 border-black rounded-base p-3 bg-white">
                      <p className="text-sm font-medium text-gray-500 italic">No changes</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        {data && (data.previous || data.next) && (
          <div className="mt-6">
            <Pagination className="font-black">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      handlePrevPage();
                    }}
                    aria-disabled={!data.previous}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      handleNextPage();
                    }}
                    aria-disabled={!data.next}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
