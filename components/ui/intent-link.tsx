"use client";

import Link from "next/link";
import { useState, type ComponentProps } from "react";

/**
 * Defers Next.js viewport RSC prefetching until pointer hover or keyboard focus
 * so fast infinite scrolling does not saturate mobile connections.
 */
export function HoverPrefetchLink({
  onMouseEnter,
  onFocus,
  ...props
}: ComponentProps<typeof Link>) {
  const [active, setActive] = useState(false);

  return (
    <Link
      {...props}
      prefetch={active ? null : false}
      onMouseEnter={(event) => {
        setActive(true);
        onMouseEnter?.(event);
      }}
      onFocus={(event) => {
        setActive(true);
        onFocus?.(event);
      }}
    />
  );
}
