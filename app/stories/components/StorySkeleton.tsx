'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function StorySkeleton() {
  return (
    <Card className="w-full shadow-[var(--shadow)] bg-[var(--background)] mb-4 sm:mb-6">
      {/* Full-width media section - no padding */}
      <div className="relative w-full border-t-2 border-[var(--border)] aspect-[9/16]">
        <Skeleton className="h-full w-full !rounded-none border-0 bg-[var(--secondary-background)]" />
      </div>
    </Card>
  );
}
