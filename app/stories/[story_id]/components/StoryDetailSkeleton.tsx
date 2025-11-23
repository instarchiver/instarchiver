import { Skeleton } from '@/components/ui/skeleton';

export function StoryDetailSkeleton() {
  return (
    <div className="fixed inset-0 pt-16 flex flex-col lg:flex-row">
      {/* Left side - Media skeleton */}
      <div className="w-full lg:w-1/2 bg-black flex items-center justify-center p-4">
        <Skeleton className="w-full max-w-md aspect-[9/16] bg-gray-800" />
      </div>

      {/* Right side - Content skeleton */}
      <div className="w-full lg:w-1/2 bg-[var(--background)] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Story info card skeleton */}
          <div className="mb-6 border-2 border-[var(--border)] rounded-[var(--radius-base)] p-4 bg-[var(--background)]">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t-2 border-[var(--border)]">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Comments section skeleton */}
          <div className="border-2 border-[var(--border)] rounded-[var(--radius-base)] p-4 bg-[var(--background)]">
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
