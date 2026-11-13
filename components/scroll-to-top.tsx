"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  clearGridScrollStateForUrl,
  consumePopNavigation,
  ensureNavigationListeners,
  getCurrentUrlKey,
} from "@/lib/scroll-restoration";

export function ScrollToTop() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    ensureNavigationListeners();
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (pathname !== window.location.pathname) {
      return;
    }
    if (consumePopNavigation(pathname)) {
      return;
    }
    clearGridScrollStateForUrl(getCurrentUrlKey());
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
