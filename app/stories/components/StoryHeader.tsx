'use client';

import React from 'react';
import { SearchBar } from '../../users/components/SearchBar';
import { ViewMode } from './StoriesGrid';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Grid3X3, LayoutGrid, List } from 'lucide-react';

interface StoryHeaderProps {
  totalStories: number;
  searchQuery: string;
  viewMode: ViewMode;
  onSearch: (query: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
  title?: string;
  subtitle?: string;
}

export function StoryHeader({
  totalStories,
  searchQuery,
  viewMode,
  onSearch,
  onViewModeChange,
  title = 'Instagram Stories Archive',
  subtitle,
}: StoryHeaderProps) {
  return (
    <div className="mb-12">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {subtitle && <p className="text-[var(--foreground)]/60">{subtitle}</p>}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <Badge variant="default">Total: {totalStories}</Badge>
              {searchQuery && <Badge variant="default">Search: {searchQuery}</Badge>}
            </div>

            {/* View mode toggle */}
            <div className="flex gap-1 border-2 border-[var(--border)] rounded-[var(--radius-base)] bg-[var(--secondary-background)] p-1">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'neutral'}
                onClick={() => onViewModeChange('grid')}
                className="h-8 px-2"
              >
                <Grid3X3 size={16} className="mr-1" />
                Grid
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'compact' ? 'default' : 'neutral'}
                onClick={() => onViewModeChange('compact')}
                className="h-8 px-2"
              >
                <LayoutGrid size={16} className="mr-1" />
                Compact
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'neutral'}
                onClick={() => onViewModeChange('list')}
                className="h-8 px-2"
              >
                <List size={16} className="mr-1" />
                List
              </Button>
            </div>
          </div>

          {/* Search bar */}
          <SearchBar
            onSearch={onSearch}
            placeholder="Search by username..."
            initialQuery={searchQuery}
            className="mb-0"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default StoryHeader;
