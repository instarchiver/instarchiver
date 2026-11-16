"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageBroken } from "@phosphor-icons/react";
import { toBlurDataUrl } from "@/lib/format";

interface MediaImageProps {
  src: string;
  alt: string;
  blurDataUrl?: string | null;
  placeholderSrc?: string | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
}

export function MediaUnavailable({ label }: { label?: string }) {
  return (
    <div
      role="img"
      aria-label={label || "Media unavailable"}
      className="absolute inset-0 flex items-center justify-center bg-muted"
    >
      <ImageBroken
        size={28}
        className="text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}

export function MediaImage({
  src,
  alt,
  blurDataUrl,
  placeholderSrc,
  className = "",
  sizes = "(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw",
  priority,
  fit = "cover",
}: MediaImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const blur = toBlurDataUrl(blurDataUrl);

  if (failedSrc === src) {
    return <MediaUnavailable label={alt || "Media unavailable"} />;
  }

  if (fit === "contain") {
    const backdropSrc = blur ?? placeholderSrc ?? src;
    const showPlaceholder = Boolean(
      placeholderSrc && placeholderSrc !== src && loadedSrc !== src
    );

    return (
      <>
        <Image
          src={backdropSrc}
          alt=""
          aria-hidden="true"
          fill
          sizes="64px"
          priority={priority}
          placeholder={backdropSrc !== blur && blur ? "blur" : undefined}
          blurDataURL={backdropSrc !== blur ? blur : undefined}
          className="pointer-events-none scale-125 object-cover blur-2xl"
        />
        {showPlaceholder && (
          <Image
            src={placeholderSrc!}
            alt=""
            aria-hidden="true"
            fill
            sizes={sizes}
            priority={priority}
            className={`object-contain ${className}`}
          />
        )}
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder={!showPlaceholder && blur ? "blur" : undefined}
          blurDataURL={!showPlaceholder ? blur : undefined}
          onLoad={() => setLoadedSrc(src)}
          onError={() => {
            setLoadedSrc(src);
            setFailedSrc(src);
          }}
          className={`object-contain ${className}`}
        />
      </>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder={blur ? "blur" : undefined}
      blurDataURL={blur}
      onError={() => setFailedSrc(src)}
      className={`object-cover ${className}`}
    />
  );
}
