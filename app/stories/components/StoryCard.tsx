'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

import { InstagramStory } from '@/app/types/instagram/story';

interface StoryCardProps {
  story: InstagramStory;
  onPreview?: (story: InstagramStory) => void;
}

export function StoryCard({ story, onPreview }: StoryCardProps) {
  return (
    <Card className="w-full shadow-[var(--shadow)] bg-[var(--background)] mb-4 sm:mb-6">
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
    </Card>
  );
}
