"use client";

import { useEffect, useRef, useState, ViewTransition } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { PostMedia } from "@/lib/api/types";
import { isVideoUrl } from "@/lib/format";
import { MediaItem } from "@/components/media/media-item";

const SWIPE_THRESHOLD_PX = 40;

export function PostCarousel({
  media,
  fallbackSrc,
  fallbackBlur,
  alt,
  transitionName,
}: {
  media: PostMedia[];
  fallbackSrc: string | null;
  fallbackBlur: string | null;
  alt: string;
  transitionName?: string;
}) {
  const [index, setIndex] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const items = media.length > 0 ? media : null;
  const total = items?.length ?? 0;

  useEffect(() => {
    if (!items || items.length <= 1) return;
    const len = items.length;
    const adjacent = new Set([(index + 1) % len, (index - 1 + len) % len]);
    for (const i of adjacent) {
      const url = items[i]?.media;
      if (url && !isVideoUrl(url)) {
        const img = new window.Image();
        img.src = url;
      }
    }
  }, [items, index]);

  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (total <= 1) return;
    if (e.target instanceof HTMLVideoElement) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (total <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || total <= 1 || e.changedTouches.length !== 1) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) <= Math.abs(dy)) {
      return;
    }
    if (dx < 0) goNext();
    else goPrev();
  };

  const current = items?.[index];
  const slideAlt = total > 1 ? `${alt} (${index + 1} of ${total})` : alt;

  const mediaFrame = (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-card">
      {current ? (
        <MediaItem
          key={current.id}
          src={current.media}
          alt={slideAlt}
          blurDataUrl={current.blur_data_url ?? fallbackBlur}
          poster={current.thumbnail ?? fallbackSrc}
          sizes="(min-width: 1024px) 40vw, 100vw"
          priority
          controls
          fit="contain"
        />
      ) : (
        <MediaItem
          key="fallback"
          src={fallbackSrc}
          alt={alt}
          blurDataUrl={fallbackBlur}
          poster={fallbackSrc}
          sizes="(min-width: 1024px) 40vw, 100vw"
          priority
          controls
          fit="contain"
        />
      )}
    </div>
  );

  return (
    <div
      role={total > 1 ? "region" : undefined}
      aria-roledescription={total > 1 ? "carousel" : undefined}
      aria-label={total > 1 ? "Post media" : undefined}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative aspect-square w-full sm:aspect-[4/5]">
        {transitionName ? (
          <ViewTransition name={transitionName} share="morph" default="none">
            {mediaFrame}
          </ViewTransition>
        ) : (
          mediaFrame
        )}

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous media"
              onClick={goPrev}
              className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <CaretLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next media"
              onClick={goNext}
              className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <CaretRight size={20} aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center">
            {items!.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Go to media ${i + 1} of ${total}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(i)}
                className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i === index ? "bg-accent" : "bg-muted-foreground/35"
                  }`}
                />
              </button>
            ))}
          </div>
          <span
            aria-live="polite"
            className="shrink-0 text-xs font-medium text-muted-foreground tabular-nums"
          >
            {index + 1} / {total}
          </span>
        </div>
      )}
    </div>
  );
}
