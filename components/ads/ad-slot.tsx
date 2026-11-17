"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT_ID } from "@/lib/consent";
import { useCookieConsent } from "@/components/consent/cookie-consent";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export interface AdSlotProps {
  slot?: string;
  variant: "leaderboard" | "rectangle";
  className?: string;
  enabled?: boolean;
}

/**
 * Policy-safe responsive Google AdSense container.
 * Renders nothing unless AdSense is configured, content is enabled, and
 * advertising consent has been granted. Uses reserved heights to avoid CLS
 * and protect virtualized grid `scrollMargin` measurements.
 */
export function AdSlot({
  slot,
  variant,
  className = "",
  enabled = true,
}: AdSlotProps) {
  const { consent } = useCookieConsent();
  const insRef = useRef<HTMLModElement | null>(null);
  const pushedForNodeRef = useRef<HTMLModElement | null>(null);

  const canRender =
    Boolean(ADSENSE_CLIENT_ID) &&
    Boolean(slot) &&
    enabled &&
    consent.advertising;

  useEffect(() => {
    if (!canRender) return;
    const node = insRef.current;
    if (!node || pushedForNodeRef.current === node) return;
    if (node.getAttribute("data-adsbygoogle-status")) {
      pushedForNodeRef.current = node;
      return;
    }

    pushedForNodeRef.current = node;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ignore duplicate or blocked AdSense push errors so the UI remains unaffected.
    }
  }, [canRender, slot, variant]);

  if (!canRender) {
    return null;
  }

  const slotHeightClass =
    variant === "leaderboard" ? "h-[100px] sm:h-[90px]" : "min-h-[250px]";

  return (
    <aside
      aria-label="Advertisement"
      className={`rounded-xl border border-border bg-card p-3 ${className}`}
    >
      <p className="mb-2 text-xs leading-4 text-muted-foreground">
        Advertisement
      </p>
      <div className={`w-full overflow-hidden ${slotHeightClass}`}>
        <ins
          ref={insRef}
          className="adsbygoogle block h-full w-full"
          style={{
            display: "block",
            width: "100%",
            height: variant === "leaderboard" ? "100%" : undefined,
            minHeight: variant === "rectangle" ? "250px" : undefined,
          }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slot || undefined}
          data-ad-format={variant === "leaderboard" ? "horizontal" : "auto"}
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
