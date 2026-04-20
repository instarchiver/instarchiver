'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSimilarStoriesQuery } from '@/hooks/useStories';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SimilarStoriesProps {
  storyId: string;
}

function SimilarStorySkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="w-full aspect-[9/16] rounded-[var(--radius-base)]" />
      <div className="flex items-center gap-2">
        <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function SimilarStories({ storyId }: SimilarStoriesProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useSimilarStoriesQuery(storyId, page);

  const isVideo = (mediaUrl: string) => {
    return mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.mov');
  };

  return (
    <Card className="mt-6 shadow-[var(--shadow)] bg-[var(--background)]">
      <CardContent className="p-4">
        <h3 className="text-lg font-[var(--font-weight-heading)] text-[var(--foreground)] mb-4 border-b-2 border-[var(--border)] pb-2">
          Similar Stories
        </h3>

        {error && (
          <p className="text-sm text-[var(--muted-foreground)] text-center py-4">
            Failed to load similar stories.
          </p>
        )}

        <div className="grid grid-cols-3 gap-2">
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => <SimilarStorySkeleton key={i} />)
            : data?.results.map(story => (
                <Link
                  key={story.story_id}
                  href={`/stories/${story.story_id}`}
                  className="group flex flex-col gap-1"
                >
                  <div className="relative w-full aspect-[9/16] overflow-hidden rounded-[var(--radius-base)] border-2 border-[var(--border)] group-hover:border-[var(--foreground)] transition-colors">
                    {isVideo(story.media) ? (
                      <>
                        <Image
                          src={story.thumbnail || story.media}
                          alt={`Story by @${story.user.username}`}
                          fill
                          sizes="(max-width: 1024px) 33vw, 16vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          placeholder={story.blur_data_url ? 'blur' : 'empty'}
                          blurDataURL={story.blur_data_url || undefined}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="white"
                              className="w-3.5 h-3.5 ml-0.5"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </>
                    ) : (
                      <Image
                        src={story.media}
                        alt={`Story by @${story.user.username}`}
                        fill
                        sizes="(max-width: 1024px) 33vw, 16vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        placeholder={story.blur_data_url ? 'blur' : 'empty'}
                        blurDataURL={story.blur_data_url || undefined}
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="relative w-5 h-5 rounded-full overflow-hidden border border-[var(--border)] flex-shrink-0">
                      <Image
                        src={story.user.profile_picture}
                        alt={story.user.username}
                        fill
                        sizes="20px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs font-[var(--font-weight-base)] text-[var(--muted-foreground)] truncate">
                      @{story.user.username}
                    </span>
                  </div>
                </Link>
              ))}
        </div>

        {data && (data.previous || data.next) && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-[var(--border)]">
            <Button
              variant="neutral"
              size="sm"
              disabled={!data.previous}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-xs font-[var(--font-weight-base)] text-[var(--muted-foreground)]">
              Page {page}
            </span>
            <Button
              variant="neutral"
              size="sm"
              disabled={!data.next}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
