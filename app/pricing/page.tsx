import { PricingContent } from './components/PricingContent';

export default function PricingPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold uppercase">Pricing</h1>
        <p className="text-foreground/70 mt-2">Choose a plan that fits your needs.</p>
      </div>

      <PricingContent />
    </main>
  );
}
