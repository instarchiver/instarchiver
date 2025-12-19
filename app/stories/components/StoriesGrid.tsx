'use client';

import { PhotosStyleGrid } from './PhotosStyleGrid';
import { InstagramStory } from '@/app/types/instagram/story';

interface StoriesGridProps {
  stories: InstagramStory[];
  onStoryPreview?: (story: InstagramStory) => void;
}

export function StoriesGrid({ stories, onStoryPreview }: StoriesGridProps) {
  return <PhotosStyleGrid stories={stories} onStoryPreview={onStoryPreview} />;
}
