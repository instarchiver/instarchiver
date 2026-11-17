"use client";

import { useLayoutEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { CookieConsentProvider } from "@/components/consent/cookie-consent";
import { NavigationProgressProvider } from "@/components/navigation-progress";
import { syncDocumentTheme, THEME_STORAGE_KEY } from "@/lib/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    syncDocumentTheme();
  }, []);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      })
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey={THEME_STORAGE_KEY}
    >
      <CookieConsentProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationProgressProvider>{children}</NavigationProgressProvider>
        </QueryClientProvider>
      </CookieConsentProvider>
    </ThemeProvider>
  );
}
