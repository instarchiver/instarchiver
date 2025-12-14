'use client';

import Image from 'next/image';
import Link from 'next/link';
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
      <Link href={`/stories/${story.story_id}`}>
        <div className="relative w-full border-t-2 border-[var(--border)] aspect-[9/16] cursor-pointer hover:opacity-90 transition-opacity">
          <Image
            src={story.thumbnail}
            alt="Story thumbnail"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            priority
            blurDataURL={`data:image/png;base64,${story.blur_data_url}`}
            placeholder={story.blur_data_url ? 'blur' : 'empty'}
          />
        </div>
      </Link>

      <CardFooter className="border-t-2 border-[var(--border)] bg-[var(--secondary-background)] flex-col gap-2 p-3">
        <div className="flex w-full justify-between items-center">
          <p className="text-sm font-[var(--font-weight-heading)] text-[var(--foreground)]">
            {formatDate(story.story_created_at)}
          </p>
        </div>
        <div className="flex w-full">
          <Link href={`/stories/${story.story_id}`} className="w-full">
            <Button className="w-full">VIEW FULL STORY</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
