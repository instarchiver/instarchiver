"use client";

import { useState, type ReactEventHandler, type Ref } from "react";
import Image from "next/image";
import { isVideoUrl, toBlurDataUrl } from "@/lib/format";
import { MediaImage, MediaUnavailable } from "./media-image";

interface MediaItemProps {
  src: string | null | undefined;
  alt: string;
  blurDataUrl?: string | null;
  sizes?: string;
  priority?: boolean;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  poster?: string | null;
  fit?: "cover" | "contain";
  videoRef?: Ref<HTMLVideoElement>;
  onVolumeChange?: ReactEventHandler<HTMLVideoElement>;
}

export function MediaItem({
  src,
  alt,
  blurDataUrl,
  sizes,
  priority,
  controls = false,
  autoPlay = false,
  loop,
  muted,
  poster,
  fit = "cover",
  videoRef,
  onVolumeChange,
}: MediaItemProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return <MediaUnavailable label={alt || "Media unavailable"} />;
  }

  if (isVideoUrl(src)) {
    const blur = toBlurDataUrl(blurDataUrl);
    const backdropSrc = blur ?? poster;
    const effectiveMuted = muted ?? autoPlay;

    return (
      <>
        {fit === "contain" && backdropSrc && (
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
        )}
        <video
          ref={videoRef}
          src={src}
          aria-label={alt || "Archived video"}
          poster={poster ?? undefined}
          controls={controls}
          autoPlay={autoPlay}
          muted={effectiveMuted}
          loop={loop ?? autoPlay}
          playsInline
          onVolumeChange={onVolumeChange}
          onError={() => setFailedSrc(src)}
          className={`absolute inset-0 h-full w-full ${
            fit === "contain" ? "object-contain" : "object-cover"
          }`}
        />
      </>
    );
  }

  return (
    <MediaImage
      src={src}
      alt={alt}
      blurDataUrl={blurDataUrl}
      placeholderSrc={poster}
      sizes={sizes}
      priority={priority}
      fit={fit}
    />
  );
}
