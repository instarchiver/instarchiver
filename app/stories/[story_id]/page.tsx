'use client';

import React from 'react';
import { useStoryByIdQuery } from '@/hooks/useStories';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { DiscussionEmbed } from 'disqus-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StoryDetailPageProps {
  params: Promise<{
    story_id: string;
  }>;
}

export default function StoryDetailPage({ params }: StoryDetailPageProps) {
  const resolvedParams = React.use(params);
  const { story_id } = resolvedParams;

  const { data: story, isLoading, error } = useStoryByIdQuery(story_id);

  const disqusConfig = story
    ? {
        url: `https://instagram-archiver.com/stories/${story.story_id}`,
        identifier: story.story_id,
        title: `Story by @${story.user.username}`,
      }
    : undefined;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const isVideo = (mediaUrl: string) => {
    return mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.mov');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 pt-16 flex">
        {/* Left side - Media skeleton */}
        <div className="w-full lg:w-1/2 bg-black flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Right side - Comments skeleton */}
        <div className="hidden lg:block lg:w-1/2 bg-[var(--background)] p-6 overflow-y-auto">
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-40 w-full mb-4" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <Card className="w-full max-w-4xl mx-auto shadow-[var(--shadow)] bg-[var(--background)]">
          <CardContent className="p-8">
            <h1 className="text-2xl font-[var(--font-weight-heading)] text-[var(--foreground)] mb-4">
              Error Loading Story
            </h1>
            <p className="text-lg font-[var(--font-weight-base)] text-[var(--foreground)] mb-4">
              Failed to load story details. The story may have been deleted or the ID is invalid.
            </p>
            <Link href="/stories">
              <Button>Back to Stories</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pt-16 flex flex-col lg:flex-row">
      {/* Left side - Media viewer */}
      <div className="w-full lg:w-1/2 bg-black flex flex-col items-center justify-center relative overflow-hidden">
        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <Link href="/stories">
            <Button variant="neutral" size="sm">
              ← Back
            </Button>
          </Link>
        </div>

        {/* User info overlay */}
        <div className="absolute top-4 right-4 z-10 bg-black/70 backdrop-blur-sm rounded-[var(--radius-base)] p-3 border-2 border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 border-2 border-[var(--border)] rounded-full overflow-hidden">
              <Image
                src={story.user.profile_picture}
                alt={story.user.username}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-[var(--font-weight-heading)] text-white">
                @{story.user.username}
              </p>
              <p className="text-xs font-[var(--font-weight-base)] text-gray-300">
                {formatDate(story.story_created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Media content */}
        <div className="w-full h-full flex items-center justify-center">
          {isVideo(story.media) ? (
            <video
              src={story.media}
              controls
              autoPlay
              loop
              className="max-w-full max-h-full object-contain"
              poster={story.thumbnail}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={story.media}
                alt="Story media"
                fill
                sizes="50vw"
                className="object-contain"
                priority
              />
            </div>
          )}
        </div>
      </div>

      {/* Right side - Disqus comments */}
      <div className="w-full lg:w-1/2 bg-[var(--background)] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Story info card */}
          <Card className="mb-6 shadow-[var(--shadow)] bg-[var(--background)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-16 h-16 border-2 border-[var(--border)] rounded-full overflow-hidden">
                  <Image
                    src={story.user.profile_picture}
                    alt={story.user.username}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <Link href={`/users/${story.user.uuid}`}>
                    <h2 className="text-xl font-[var(--font-weight-heading)] text-[var(--foreground)] hover:underline">
                      @{story.user.username}
                    </h2>
                  </Link>
                  <p className="text-sm font-[var(--font-weight-base)] text-[var(--muted-foreground)]">
                    {story.user.full_name}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-[var(--font-weight-heading)] text-[var(--muted-foreground)]">
                    Posted:
                  </span>
                  <span className="font-[var(--font-weight-base)] text-[var(--foreground)]">
                    {formatDate(story.story_created_at)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-[var(--font-weight-heading)] text-[var(--muted-foreground)]">
                    Archived:
                  </span>
                  <span className="font-[var(--font-weight-base)] text-[var(--foreground)]">
                    {formatDate(story.created_at)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t-2 border-[var(--border)]">
                <Link href={`/users/${story.user.uuid}`}>
                  <Button variant="neutral" className="w-full">
                    View Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Disqus comments */}
          <Card className="shadow-[var(--shadow)] bg-[var(--background)]">
            <CardContent className="p-4">
              <h3 className="text-xl font-[var(--font-weight-heading)] text-[var(--foreground)] mb-4">
                Comments
              </h3>
              {disqusConfig && (
                <DiscussionEmbed shortname="instagram-archiver" config={disqusConfig} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
