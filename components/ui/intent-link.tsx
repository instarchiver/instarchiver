"use client";

import Link from "next/link";
import { useRef, useState, type ComponentProps } from "react";
import { isVideoUrl } from "@/lib/format";

/**
 * Defers Next.js viewport RSC prefetching until pointer or keyboard intent
 * so fast infinite scrolling does not saturate mobile connections.
 */
export function HoverPrefetchLink({
  prefetch: activePrefetch = null,
  preloadSrc,
  onMouseEnter,
  onFocus,
  onPointerDown,
  onTouchStart,
  ...props
}: ComponentProps<typeof Link> & {
  preloadSrc?: string | null;
}) {
  const [active, setActive] = useState(false);
  const preloadedRef = useRef<string | null>(null);

  function triggerIntent() {
    setActive(true);
    if (
      preloadSrc &&
      preloadedRef.current !== preloadSrc &&
      !isVideoUrl(preloadSrc)
    ) {
      preloadedRef.current = preloadSrc;
      const img = new window.Image();
      img.src = preloadSrc;
    }
  }

  return (
    <Link
      {...props}
      prefetch={active ? activePrefetch : false}
      onMouseEnter={(event) => {
        triggerIntent();
        onMouseEnter?.(event);
      }}
      onFocus={(event) => {
        triggerIntent();
        onFocus?.(event);
      }}
      onPointerDown={(event) => {
        triggerIntent();
        onPointerDown?.(event);
      }}
      onTouchStart={(event) => {
        triggerIntent();
        onTouchStart?.(event);
      }}
    />
  );
}
