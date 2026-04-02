import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | Instarchiver',
  description:
    'View subscription plans and pricing for Instarchiver. Get full access to Instagram story and profile archiving.',
  keywords: ['pricing', 'subscription', 'plans', 'Instagram archiver', 'Instarchiver'],
  openGraph: {
    title: 'Pricing',
    description: 'View subscription plans and pricing for Instarchiver.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing | Instarchiver',
    description: 'View subscription plans and pricing for Instarchiver.',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <section className="bg-background min-h-screen">{children}</section>;
}
