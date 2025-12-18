'use client';

import { usePosts } from '@/hooks/usePosts';
import { PostCard } from '@/components/posts/PostCard';
import { PostCardSkeleton } from '@/components/posts/PostCardSkeleton';
import { MasonryGrid } from '@/components/posts/MasonryGrid';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Grid3x3, ArrowLeft, Search, X } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { VideoPlaybackProvider } from '@/contexts/VideoPlaybackContext';
import { useRouter, useSearchParams } from 'next/navigation';

function PostsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(searchQuery);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    usePosts(searchQuery);
  const { ref, inView } = useInView();

  // Sync search input with URL params
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Auto-fetch next page when scrolling to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSearch = searchInput.trim();

    if (trimmedSearch) {
      router.push(`/posts?search=${encodeURIComponent(trimmedSearch)}`);
    } else {
      router.push('/posts');
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    router.push('/posts');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background">
        {/* Search Section Skeleton */}
        <div className="w-full py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-6">
              <div className="h-12 w-80 bg-foreground/10 rounded animate-pulse" />
              <div className="w-full max-w-2xl">
                <div className="h-14 w-full bg-foreground/10 rounded-full animate-pulse" />
              </div>
              <div className="h-4 w-32 bg-foreground/10 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Posts Grid Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <MasonryGrid>
            {Array.from({ length: 12 }).map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </MasonryGrid>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-secondary-background border-2 border-border rounded-xl p-8 shadow-shadow">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-chart-4 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-main-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Failed to Load Posts</h2>
            <p className="text-foreground/60">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const allPosts = data?.pages.flatMap(page => page.results) ?? [];

  return (
    <VideoPlaybackProvider>
      <div className="min-h-[calc(100vh-4rem)] bg-background">
        {/* Search Section */}
        <div className="w-full py-8 sm:py-8 lg:py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-center">
                Search Instagram Posts
              </h1>
              <form onSubmit={handleSearch} className="w-full max-w-2xl">
                <div className="relative">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="Search by caption, username, or hashtag..."
                    className={`w-full px-6 py-4 text-base sm:text-lg bg-secondary-background border-2 border-border rounded-full shadow-shadow focus:outline-none focus:ring-2 focus:ring-main focus:border-main transition-all ${
                      searchInput ? 'pr-[100px]' : 'pr-[60px]'
                    }`}
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-[60px] top-1/2 -translate-y-1/2 p-2 text-foreground/60 hover:text-foreground transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-main text-main-foreground rounded-full font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {allPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-secondary-background border-2 border-border rounded-full flex items-center justify-center mb-4">
                <Grid3x3 className="w-10 h-10 text-foreground/40" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">No Posts Found</h2>
              <p className="text-foreground/60">There are no posts to display at the moment.</p>
            </div>
          ) : (
            <>
              <MasonryGrid>
                {allPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </MasonryGrid>

              {/* Infinite Scroll Trigger */}
              <div ref={ref} className="flex justify-center py-8">
                {isFetchingNextPage && (
                  <div className="flex items-center gap-2 text-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-medium">Loading more posts...</span>
                  </div>
                )}
                {!hasNextPage && allPosts.length > 0 && (
                  <div className="text-foreground/60 font-medium">
                    You&apos;ve reached the end! 🎉
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </VideoPlaybackProvider>
  );
}

export default function PostsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] bg-background">
          {/* Search Section Skeleton */}
          <div className="w-full py-12 sm:py-16 lg:py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center gap-6">
                <div className="h-12 w-80 bg-foreground/10 rounded animate-pulse" />
                <div className="w-full max-w-2xl">
                  <div className="h-14 w-full bg-foreground/10 rounded-full animate-pulse" />
                </div>
                <div className="h-4 w-32 bg-foreground/10 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Posts Grid Skeleton */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <MasonryGrid>
              {Array.from({ length: 12 }).map((_, index) => (
                <PostCardSkeleton key={index} />
              ))}
            </MasonryGrid>
          </div>
        </div>
      }
    >
      <PostsPageContent />
    </Suspense>
  );
}
