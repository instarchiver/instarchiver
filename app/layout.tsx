import type { Metadata } from 'next';
import { Red_Hat_Text } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Navigation } from '@/components/ui/navigation';

const redHatText = Red_Hat_Text({
  variable: '--font-red-hat-text',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Instagram Archiver',
  description: 'Archive and browse Instagram user profiles and content',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'system';
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                const appliedTheme = theme === 'system' ? systemTheme : theme;
                if (appliedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${redHatText.variable} antialiased bg-background text-foreground font-base`}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6CJW2BM9NS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6CJW2BM9NS');
          `}
        </Script>
        {/* Google Analytics */}

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <Navigation />
            <div className="pt-16">{children}</div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
