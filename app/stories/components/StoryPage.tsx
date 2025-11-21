'use client';

import React, { Suspense } from 'react';
import StoryHeader from './StoryHeader';
import { ViewMode } from './StoriesGrid';

interface StoryPageProps {
  totalStories: number;
  searchQuery: string;
  viewMode: ViewMode;
  onSearch: (query: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
  storiesContent: React.ReactNode;
  pagination: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function StoryPage({
  totalStories,
  searchQuery,
  viewMode,
  onSearch,
  onViewModeChange,
  storiesContent,
  pagination,
  title,
  subtitle,
}: StoryPageProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header with neo-brutalist design */}
      <Suspense
        fallback={
          <div className="mb-8 relative animate-pulse">
            <div className="absolute -top-2 -left-2 w-full h-full bg-yellow-400 border-4 border-black -z-10 transform rotate-1"></div>
            <div className="bg-white border-4 border-black p-8 relative z-10">
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-full"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                <div className="flex gap-4 mt-6">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-28"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded w-full mt-6"></div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="h-12 bg-gray-200 rounded w-full sm:w-48"></div>
                  <div className="h-12 bg-gray-200 rounded w-full sm:w-40"></div>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <StoryHeader
          totalStories={totalStories}
          searchQuery={searchQuery}
          viewMode={viewMode}
          onSearch={onSearch}
          onViewModeChange={onViewModeChange}
          title={title}
          subtitle={subtitle}
        />
      </Suspense>

      {/* Stories content */}
      {storiesContent}

      {/* Pagination controls */}
      {pagination}
    </div>
  );
}

export default StoryPage;
