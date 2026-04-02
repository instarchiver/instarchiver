export interface PlanFeature {
  id: number;
  label: string;
  is_available: boolean;
  sort_order: number;
}

export interface Plan {
  id: number;
  name: string;
  description: string;
  billing_period: string;
  price: string;
  currency: string;
  features: PlanFeature[];
  sort_order: number;
}
