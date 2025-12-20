'use client';

import { InstagramStory } from '@/app/types/instagram/story';
import { StoryCard } from './StoryCard';
import { Card } from '@/components/ui/card';

interface PhotosStyleGridProps {
  stories: InstagramStory[];
  onStoryPreview?: (story: InstagramStory) => void;
}

// Define patterns for grid items (similar to Google Photos)
// Each pattern specifies: colSpan (1 or 2) and rowSpan (1 or 2)
const GRID_PATTERNS = [
  // Pattern 1: Large item at start
  [
    { cols: 2, rows: 2 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
  ],
  // Pattern 2: Two medium items
  [
    { cols: 1, rows: 2 },
    { cols: 1, rows: 2 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
  ],
  // Pattern 3: Large item in middle
  [
    { cols: 1, rows: 1 },
    { cols: 2, rows: 2 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
  ],
  // Pattern 4: Regular items
  [
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
  ],
  // Pattern 5: Tall items
  [
    { cols: 1, rows: 2 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 2 },
  ],
];

export function PhotosStyleGrid({ stories, onStoryPreview }: PhotosStyleGridProps) {
  if (stories.length === 0) {
    return (
      <Card className="mt-10 p-12 text-center border-2 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] bg-yellow-200">
        <h3 className="text-4xl font-black mb-6 text-black">NO STORIES FOUND</h3>
        <p className="text-xl font-bold text-black">
          Try a different search query or check back later.
        </p>
      </Card>
    );
  }

  // Assign patterns to stories
  const storiesWithLayout = stories.map((story, index) => {
    const patternIndex = Math.floor(index / 5) % GRID_PATTERNS.length;
    const itemIndexInPattern = index % GRID_PATTERNS[patternIndex].length;
    const layout = GRID_PATTERNS[patternIndex][itemIndexInPattern];

    return {
      story,
      layout,
    };
  });

  return (
    <div className="grid grid-flow-dense grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 auto-rows-[200px]">
      {storiesWithLayout.map(({ story, layout }) => (
        <div
          key={story.story_id}
          className={`
            ${layout.cols === 2 ? 'col-span-2' : 'col-span-1'}
            ${layout.rows === 2 ? 'row-span-2' : 'row-span-1'}
          `}
        >
          <StoryCard story={story} onPreview={onStoryPreview} />
        </div>
      ))}
    </div>
  );
}
