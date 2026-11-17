import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SITE_URL } from "@/lib/api/client";
import { ADSENSE_CLIENT_ID, CONSENT_STORAGE_KEY } from "@/lib/consent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | InstArchiver",
    default: "InstArchiver",
  },
  description:
    "InstArchiver keeps a searchable archive of Instagram profiles, stories, and posts, including profile history over time.",
  openGraph: { siteName: "InstArchiver", type: "website" },
  twitter: { card: "summary_large_image" },
  other: { "google-adsense-account": ADSENSE_CLIENT_ID },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <ScrollToTop />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-accent-foreground focus:outline-2 focus:outline-offset-2 focus:outline-ring"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <Footer />
        </Providers>
        <Script id="google-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;
            var defaultConsent = {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              wait_for_update: 500
            };
            try {
              var rawConsent = window.localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)});
              if (rawConsent) {
                var savedConsent = JSON.parse(rawConsent);
                if (savedConsent && typeof savedConsent.analytics === 'boolean' && typeof savedConsent.advertising === 'boolean') {
                  defaultConsent.analytics_storage = savedConsent.analytics ? 'granted' : 'denied';
                  defaultConsent.ad_storage = savedConsent.advertising ? 'granted' : 'denied';
                  defaultConsent.ad_user_data = savedConsent.advertising ? 'granted' : 'denied';
                  defaultConsent.ad_personalization = savedConsent.advertising ? 'granted' : 'denied';
                }
              }
            } catch (e) {}
            gtag('consent', 'default', defaultConsent);
          `}
        </Script>
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
        {ADSENSE_CLIENT_ID && (
          <Script
            id="google-adsense"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
