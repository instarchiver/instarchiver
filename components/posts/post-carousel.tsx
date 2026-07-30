"use client";

import { useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { PostMedia } from "@/lib/api/types";
import { MediaItem } from "@/components/media/media-item";

export function PostCarousel({
  media,
  fallbackSrc,
  fallbackBlur,
  alt,
}: {
  media: PostMedia[];
  fallbackSrc: string | null;
  fallbackBlur: string | null;
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const items = media.length > 0 ? media : null;
  const total = items?.length ?? 0;

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-card sm:aspect-[4/5]">
      {items ? (
        <MediaItem
          src={items[index].media}
          alt={alt}
          blurDataUrl={items[index].blur_data_url}
          sizes="(min-width: 1024px) 40vw, 100vw"
          priority
          controls
        />
      ) : (
        <MediaItem
          src={fallbackSrc}
          alt={alt}
          blurDataUrl={fallbackBlur}
          sizes="(min-width: 1024px) 40vw, 100vw"
          priority
          controls
        />
      )}

      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous media"
            onClick={() => setIndex((i) => (i - 1 + total) % total)}
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-black/70"
          >
            <CaretLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Next media"
            onClick={() => setIndex((i) => (i + 1) % total)}
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-black/70"
          >
            <CaretRight size={20} />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {items!.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Go to media ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 cursor-pointer rounded-full transition-colors ${
                  i === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
