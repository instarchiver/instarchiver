'use client';

import React, { useState, useEffect } from 'react';
import { SearchBar } from '@/components/ui/search-bar';
import { ViewMode } from './StoriesGrid';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Grid3X3, LayoutGrid, List } from 'lucide-react';

interface StoryHeaderProps {
  searchQuery: string;
  viewMode: ViewMode;
  onSearch: (query: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
  title?: string;
  subtitle?: string;
}

export function StoryHeader({
  searchQuery,
  viewMode,
  onSearch,
  onViewModeChange,
  title = 'Instagram Stories Archive',
  subtitle,
}: StoryHeaderProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Sync local state with prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (value: string) => {
    onSearch(value);
  };

  const handleSearchClear = () => {
    onSearch('');
  };

  return (
    <div className="mb-12">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {subtitle && <p className="text-[var(--foreground)]/60">{subtitle}</p>}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            {/* View mode toggle */}
            <div className="flex gap-1 border-2 border-[var(--border)] rounded-[var(--radius-base)] bg-[var(--secondary-background)] p-1 ml-auto">
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
            value={localSearchQuery}
            onChange={setLocalSearchQuery}
            onSubmit={handleSearchSubmit}
            onClear={handleSearchClear}
            placeholder="Search by username..."
            className="mb-0"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default StoryHeader;
