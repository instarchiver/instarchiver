import React, { useState, useEffect } from 'react';
import { SearchBar } from '@/components/ui/search-bar';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';

interface UserHeaderProps {
  totalUsers: number;
  currentPage: number;
  viewMode?: 'compact' | 'detailed';
  onViewModeChange?: (mode: 'compact' | 'detailed') => void;
}

export function UserHeader({
  totalUsers,
  currentPage,
  title = 'Instagram User Archive',
  subtitle,
  viewMode = 'detailed',
  onViewModeChange,
}: UserHeaderProps & { title?: string; subtitle?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Sync local state with URL changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (value: string) => {
    const params = new URLSearchParams();
    if (value.trim()) {
      params.set('search', value.trim());
    }
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.push(newUrl);
  };

  const handleSearchClear = () => {
    router.push(window.location.pathname);
  };

  return (
    <div className="mb-12">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <Badge variant="default">Total: {totalUsers}</Badge>
              <Badge variant="default">Page: {currentPage}</Badge>
              {searchQuery && <Badge variant="default">Search: {searchQuery}</Badge>}
            </div>

            {/* View mode toggle */}
            {onViewModeChange && (
              <div className="flex gap-1 border-2 border-[var(--border)] rounded-[var(--radius-base)] bg-[var(--secondary-background)] p-1">
                <Button
                  size="sm"
                  variant={viewMode === 'compact' ? 'default' : 'neutral'}
                  onClick={() => onViewModeChange('compact')}
                  className="h-8 px-2"
                >
                  <List size={16} className="mr-1" />
                  Compact
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'detailed' ? 'default' : 'neutral'}
                  onClick={() => onViewModeChange('detailed')}
                  className="h-8 px-2"
                >
                  <Grid size={16} className="mr-1" />
                  Detailed
                </Button>
              </div>
            )}
          </div>

          {/* Add the search bar component if showing users list */}
          {title === 'Instagram User Archive' && (
            <SearchBar
              value={localSearchQuery}
              onChange={setLocalSearchQuery}
              onSubmit={handleSearchSubmit}
              onClear={handleSearchClear}
              placeholder="Search users by username..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default UserHeader;
