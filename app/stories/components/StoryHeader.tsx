'use client';

import React, { useState, useEffect } from 'react';
import { SearchBar } from '@/components/ui/search-bar';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

interface StoryHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  title?: string;
  subtitle?: string;
}

export function StoryHeader({
  searchQuery,
  onSearch,
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
