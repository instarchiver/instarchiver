import { Card } from '@/components/ui/card';

export function PostCardSkeleton() {
  return (
    <Card className="overflow-hidden border-2 border-border shadow-shadow bg-secondary-background animate-pulse">
      {/* Thumbnail Skeleton */}
      <div className="relative aspect-square overflow-hidden bg-background">
        <div className="w-full h-full bg-foreground/10" />

        {/* Variant Badge Skeleton */}
        <div className="absolute top-2 right-2">
          <div className="h-6 w-20 bg-foreground/20 rounded-md border-2 border-border" />
        </div>
      </div>

      {/* Post Info Skeleton */}
      <div className="p-4 space-y-3">
        {/* User Info Skeleton */}
        <div className="flex items-center gap-2">
          {/* Avatar Skeleton */}
          <div className="w-8 h-8 rounded-full border-2 border-border bg-foreground/10" />

          <div className="flex-1 min-w-0 space-y-1">
            {/* Username Skeleton */}
            <div className="h-4 w-24 bg-foreground/10 rounded" />
            {/* Full Name Skeleton */}
            <div className="h-3 w-32 bg-foreground/10 rounded" />
          </div>
        </div>

        {/* Post Date Skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-foreground/10 rounded" />
          <div className="h-3 w-28 bg-foreground/10 rounded" />
        </div>
      </div>
    </Card>
  );
}
