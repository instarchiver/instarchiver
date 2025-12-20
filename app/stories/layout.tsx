import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instagram Stories | Instarchiver',
  description:
    'Browse and archive Instagram stories. Search through saved stories and discover content from Instagram users.',
  keywords: [
    'Instagram stories',
    'story archive',
    'Instagram archiver',
    'saved stories',
    'browse stories',
  ],
  openGraph: {
    title: 'Instagram Stories',
    description: 'Browse and archive Instagram stories from users around the world.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instagram Stories Archive',
    description: 'Browse and archive Instagram stories from users around the world.',
  },
};

export default function StoriesLayout({ children }: { children: React.ReactNode }) {
  return <section className="bg-background min-h-screen">{children}</section>;
}
