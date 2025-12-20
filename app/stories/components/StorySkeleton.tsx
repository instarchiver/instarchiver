'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function StorySkeleton() {
  return (
    <Card className="w-full h-full shadow-[var(--shadow)] bg-[var(--background)]">
      {/* Full-width media section - no padding, fills the entire card */}
      <div className="relative w-full h-full border-t-2 border-[var(--border)]">
        <Skeleton className="absolute inset-0 w-full h-full !rounded-none border-0 bg-[var(--secondary-background)]" />
      </div>
    </Card>
  );
}
