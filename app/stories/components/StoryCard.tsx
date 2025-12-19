'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardFooter } from '@/components/ui/card';

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

      <CardFooter className="border-t-2 border-[var(--border)] bg-[var(--secondary-background)] p-3">
        <p className="text-sm font-[var(--font-weight-heading)] text-[var(--foreground)]">
          {formatDate(story.story_created_at)}
        </p>
      </CardFooter>
    </Card>
  );
}
