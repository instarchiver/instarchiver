'use client';

import { Suspense } from 'react';
import { usePlansQuery } from '@/hooks/usePricing';
import { PricingCard } from './PricingCard';
import { PricingCardSkeleton } from './PricingCardSkeleton';

function PricingSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <PricingCardSkeleton key={i} />
      ))}
    </div>
  );
}

function PricingCards() {
  const { data: plans, isLoading, isError } = usePlansQuery();

  if (isLoading) {
    return <PricingSkeletonGrid />;
  }

  if (isError) {
    return (
      <div className="border-2 border-border bg-secondary-background rounded-base p-8 text-center">
        <p className="font-heading text-lg">Failed to load pricing plans.</p>
        <p className="text-sm text-foreground/60 mt-1">Please try again later.</p>
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="border-2 border-border bg-secondary-background rounded-base p-8 text-center">
        <p className="font-heading text-lg">No plans available.</p>
      </div>
    );
  }

  const sortedPlans = [...plans].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedPlans.map(plan => (
        <PricingCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}

export function PricingContent() {
  return (
    <Suspense fallback={<PricingSkeletonGrid />}>
      <PricingCards />
    </Suspense>
  );
}
