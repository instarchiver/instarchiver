import { Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plan } from '@/app/types/pricing';

interface PricingCardProps {
  plan: Plan;
}

function formatPrice(price: string, currency: string, billingPeriod: string): string {
  const amount = parseFloat(price);
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
  return `${formatted}/${billingPeriod}`;
}

export function PricingCard({ plan }: PricingCardProps) {
  const sortedFeatures = [...plan.features].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <Card className="flex flex-col">
      <CardHeader className="border-b-2 border-border bg-secondary-background">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="font-heading text-xl uppercase">{plan.name}</CardTitle>
          <Badge variant="default" className="shrink-0 capitalize">
            {plan.billing_period}
          </Badge>
        </div>
        <p className="text-sm text-foreground/70 mt-1">{plan.description}</p>
        <p className="font-heading text-3xl font-bold mt-3">
          {formatPrice(plan.price, plan.currency, plan.billing_period)}
        </p>
      </CardHeader>

      <CardContent className="flex-1 pt-4">
        <ul className="space-y-3">
          {sortedFeatures.map(feature => (
            <li key={feature.id} className="flex items-center gap-3">
              {feature.is_available ? (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-base border-2 border-border bg-main">
                  <Check className="h-3 w-3 text-main-foreground" strokeWidth={3} />
                </span>
              ) : (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-base border-2 border-border bg-secondary-background">
                  <X className="h-3 w-3 text-foreground/40" strokeWidth={3} />
                </span>
              )}
              <span
                className={
                  feature.is_available ? 'text-sm font-base' : 'text-sm font-base text-foreground/40'
                }
              >
                {feature.label}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
