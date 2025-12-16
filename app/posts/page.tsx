'use client';

import { usePosts } from '@/hooks/usePosts';
import { PostCard } from '@/components/posts/PostCard';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Grid3x3, ArrowLeft } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import Link from 'next/link';

export default function PostsPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    usePosts();
  const { ref, inView } = useInView();

  // Auto-fetch next page when scrolling to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-main" />
          <p className="text-foreground font-bold text-lg">Loading posts...</p>
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
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Header */}
      <div className="bg-secondary-background border-b-2 border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="neutral" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-main rounded-lg flex items-center justify-center">
                  <Grid3x3 className="w-6 h-6 text-main-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Instagram Posts
                  </h1>
                  <p className="text-sm text-foreground/60">
                    {allPosts.length} {allPosts.length === 1 ? 'post' : 'posts'} loaded
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {allPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

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
  );
}
