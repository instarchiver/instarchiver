import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function PricingCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="border-b-2 border-border bg-secondary-background">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-9 w-28 mt-3" />
      </CardHeader>

      <CardContent className="flex-1 pt-4">
        <ul className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <li key={i} className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 shrink-0" />
              <Skeleton className="h-4 flex-1" />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
