'use client';

import Image from 'next/image';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InstagramStory } from '@/app/types/instagram/story';

interface StoryCardProps {
  story: InstagramStory;
  onPreview?: (story: InstagramStory) => void;
}

export function StoryCard({ story, onPreview }: StoryCardProps) {
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

  return (
    <Card className="w-full shadow-[var(--shadow)] bg-[var(--background)]">
      <CardHeader className="py-3 bg-[var(--main)]">
        <div className="flex items-center gap-2">
          {/* Profile image */}
          <div className="relative min-w-[48px] min-h-[48px] border-2 border-[var(--border)] rounded-full overflow-hidden bg-[var(--secondary-background)]">
            <Image
              src={story.user.profile_picture}
              alt={story.user.username}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <CardTitle className="text-lg text-[var(--foreground)] font-[var(--font-weight-heading)] truncate">
              @{story.user.username}
            </CardTitle>
            <CardDescription className="text-sm font-[var(--font-weight-base)] text-[var(--foreground)] truncate">
              {story.user.full_name}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* Full-width media section - no padding */}
      <div
        className="relative w-full border-t-2 border-[var(--border)] group aspect-[9/16] cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => onPreview?.(story)}
      >
        <Image
          src={story.thumbnail}
          alt="Story thumbnail"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="bg-white/90 rounded-full p-2 shadow-lg">
            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.242.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.049 5.927c.3-.921 1.603-.921 1.902 0a1.286 1.286 0 001.851.63c.423-.305 1.172-.305 1.495 0 .324.305.324 1.054 0 1.36a1.286 1.286 0 00-.63 1.851c-.305.423-.305 1.172 0 1.495.305.324 1.054.324 1.36 0a1.286 1.286 0 001.851.63c.423.305.423 1.172 0 1.495-.305.324-1.054.324-1.36 0a1.286 1.286 0 00-1.851.63c-.305.423-1.172.423-1.495 0-.324-.305-.324-1.054 0-1.36a1.286 1.286 0 00.63-1.851c-.423-.305-.423-1.172 0-1.495.305-.324.305-1.054 0-1.36a1.286 1.286 0 00-1.851-.63c-.305-.423-1.172-.423-1.495 0-.324.305-.324 1.054 0 1.36a1.286 1.286 0 00-.63 1.851c.305.423.305 1.172 0 1.495-.305.324-1.054.324-1.36 0a1.286 1.286 0 00-1.851-.63c-.423-.305-.423-1.172 0-1.495.305-.324 1.054-.324 1.36 0a1.286 1.286 0 001.851-.63z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <CardFooter className="border-t-2 border-[var(--border)] bg-[var(--secondary-background)] flex-col gap-2 p-3">
        <div className="flex w-full justify-between items-center">
          <p className="text-sm font-[var(--font-weight-heading)] text-[var(--foreground)]">
            {formatDate(story.story_created_at)}
          </p>
        </div>
        <div className="flex w-full">
          <Button onClick={() => onPreview?.(story)}>VIEW FULL STORY</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
