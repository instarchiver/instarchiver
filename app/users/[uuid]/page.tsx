'use client';

import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { UserDetailSkeleton } from './components/UserDetailSkeleton';
import { UserHistoryGrid } from './components/UserHistoryGrid';
import { DisqusWrapper } from '@/components/ui/disqus-wrapper';
import { formatNumber, formatDate } from '../utils/formatters';
import { useUserById } from '@/hooks/useUsers';

interface UserDetailPageProps {
  params: Promise<{
    uuid: string;
  }>;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const resolvedParams = React.use(params);
  const { uuid } = resolvedParams;

  const { data: user, isLoading, error } = useUserById(uuid);

  if (isLoading) {
    return <UserDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto shadow-[var(--shadow)] bg-[var(--background)]">
          <CardHeader className="border-b-2 border-[var(--border)] bg-[var(--main)]">
            <CardTitle className="text-[var(--foreground)] font-[var(--font-weight-heading)]">
              Error
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-lg font-[var(--font-weight-heading)] text-[var(--foreground)]">
              Failed to load user details
            </p>
            <Link href="/users">
              <Button className="mt-4">Back to Users</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) return null;

  const disqusConfig = {
    url: `https://instagram-archiver.com/users/${user.uuid}`,
    identifier: user.uuid,
    title: `${user.username}'s Profile`,
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="w-full max-w-4xl mx-auto shadow-[var(--shadow)] bg-[var(--background)]">
        <CardHeader className="border-b-2 border-[var(--border)] bg-[var(--main)] p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 border-4 border-[var(--border)] rounded-full overflow-hidden bg-[var(--secondary-background)] shrink-0">
              {user.profile_picture ? (
                <Image
                  src={user.profile_picture}
                  alt={user.username}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[var(--secondary-background)]">
                  <span className="text-4xl font-[var(--font-weight-heading)] text-[var(--foreground)]">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 w-full">
              <div className="flex flex-col items-center sm:items-start">
                <div className="text-center sm:text-left">
                  <CardTitle className="text-2xl sm:text-3xl font-[var(--font-weight-heading)] text-[var(--foreground)] mb-2">
                    @{user.username}
                  </CardTitle>
                  {user.full_name && (
                    <p className="text-lg sm:text-xl font-[var(--font-weight-heading)] text-[var(--foreground)] mb-4">
                      {user.full_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4">
                <div className="border-2 border-[var(--border)] rounded-[var(--radius-base)] p-2 sm:p-4 text-center bg-[var(--secondary-background)]">
                  <p className="text-xs sm:text-sm font-[var(--font-weight-heading)] text-[var(--foreground)]">
                    POSTS
                  </p>
                  <p className="text-lg sm:text-2xl font-[var(--font-weight-heading)] text-[var(--foreground)]">
                    {formatNumber(user.media_count)}
                  </p>
                </div>
                <div className="border-2 border-[var(--border)] rounded-[var(--radius-base)] p-2 sm:p-4 text-center bg-[var(--secondary-background)]">
                  <p className="text-xs sm:text-sm font-[var(--font-weight-heading)] text-[var(--foreground)]">
                    FOLLOWERS
                  </p>
                  <p className="text-lg sm:text-2xl font-[var(--font-weight-heading)] text-[var(--foreground)]">
                    {formatNumber(user.follower_count)}
                  </p>
                </div>
                <div className="border-2 border-[var(--border)] rounded-[var(--radius-base)] p-2 sm:p-4 text-center bg-[var(--secondary-background)]">
                  <p className="text-xs sm:text-sm font-[var(--font-weight-heading)] text-[var(--foreground)]">
                    FOLLOWING
                  </p>
                  <p className="text-lg sm:text-2xl font-[var(--font-weight-heading)] text-[var(--foreground)]">
                    {formatNumber(user.following_count)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-[var(--font-weight-heading)] text-[var(--foreground)] mb-3 sm:mb-4">
              Biography
            </h2>
            {user.biography ? (
              <div className="border-2 border-[var(--border)] rounded-[var(--radius-base)] bg-[var(--secondary-background)]">
                <ScrollArea className="h-[100px] sm:h-[120px] w-full p-3 sm:p-4">
                  <p className="font-[var(--font-weight-base)] text-[var(--foreground)] text-sm sm:text-base">
                    {user.biography}
                  </p>
                </ScrollArea>
              </div>
            ) : (
              <div className="border-2 border-[var(--border)] rounded-[var(--radius-base)] bg-[var(--secondary-background)] p-3 sm:p-4">
                <p className="font-[var(--font-weight-base)] text-[var(--foreground)] text-sm sm:text-base italic">
                  No biography available
                </p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-[var(--font-weight-heading)] text-[var(--foreground)] mb-4">
              Account Information
            </h2>
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--secondary-background)] border-2 border-[var(--border)] rounded-[var(--radius-base)] hover:-translate-y-0.5 transition-transform duration-200">
                <span className="text-sm font-[var(--font-weight-heading)] text-[var(--muted-foreground)]">
                  LAST UPDATED:
                </span>
                <span className="text-sm font-[var(--font-weight-heading)] text-[var(--foreground)]">
                  {formatDate(user.updated_at)}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--secondary-background)] border-2 border-[var(--border)] rounded-[var(--radius-base)] hover:-translate-y-0.5 transition-transform duration-200">
                <span className="text-sm font-[var(--font-weight-heading)] text-[var(--muted-foreground)]">
                  VERIFIED:
                </span>
                <span className="text-sm font-[var(--font-weight-heading)] text-[var(--foreground)]">
                  {user.is_verified ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--secondary-background)] border-2 border-[var(--border)] rounded-[var(--radius-base)] hover:-translate-y-0.5 transition-transform duration-200">
                <span className="text-sm font-[var(--font-weight-heading)] text-[var(--muted-foreground)]">
                  PRIVATE:
                </span>
                <span className="text-sm font-[var(--font-weight-heading)] text-[var(--foreground)]">
                  {user.is_private ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t-2 border-[var(--border)] bg-[var(--secondary-background)] p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
            {user.has_history ? (
              <Link href={`/users/${user.uuid}/history`} className="flex-1">
                <Button
                  variant="neutral"
                  className="w-full font-[var(--font-weight-heading)]"
                  data-testid="history-button"
                >
                  VIEW HISTORY
                </Button>
              </Link>
            ) : (
              <div className="flex-1">
                <Button
                  variant="neutral"
                  className="w-full font-[var(--font-weight-heading)]"
                  data-testid="history-button"
                  disabled
                >
                  VIEW HISTORY
                </Button>
              </div>
            )}
            {user.has_stories ? (
              <Link
                href={`/stories?search=${encodeURIComponent(user.username)}`}
                className="flex-1"
              >
                <Button className="w-full font-[var(--font-weight-heading)]">VIEW STORIES</Button>
              </Link>
            ) : (
              <div className="flex-1">
                <Button disabled={true} className="w-full font-[var(--font-weight-heading)]">
                  VIEW STORIES
                </Button>
              </div>
            )}
            <div className="flex-1">
              <Button
                disabled={true}
                variant="neutral"
                className="w-full font-[var(--font-weight-heading)]"
              >
                ARCHIVE POSTS
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Card className="w-full max-w-4xl mx-auto border-2 border-[var(--border)] shadow-[var(--shadow)] ">
        <CardHeader>
          <CardTitle className="text-2xl font-[var(--font-weight-heading)] text-[var(--foreground)]"></CardTitle>
        </CardHeader>
        <CardContent>
          <DisqusWrapper shortname="instagram-archiver" config={disqusConfig} />
        </CardContent>
      </Card>
    </div>
  );
}
