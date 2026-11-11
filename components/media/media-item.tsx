import Image from "next/image";
import { ImageBroken } from "@phosphor-icons/react/ssr";
import { isVideoUrl, toBlurDataUrl } from "@/lib/format";
import { MediaImage } from "./media-image";

interface MediaItemProps {
  src: string | null | undefined;
  alt: string;
  blurDataUrl?: string | null;
  sizes?: string;
  priority?: boolean;
  controls?: boolean;
  autoPlay?: boolean;
  poster?: string | null;
  fit?: "cover" | "contain";
}

export function MediaItem({
  src,
  alt,
  blurDataUrl,
  sizes,
  priority,
  controls = false,
  autoPlay = false,
  poster,
  fit = "cover",
}: MediaItemProps) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted">
        <ImageBroken size={28} className="text-muted-foreground" />
      </div>
    );
  }

  if (isVideoUrl(src)) {
    const blur = toBlurDataUrl(blurDataUrl);
    const backdropSrc = poster ?? blur;

    return (
      <>
        {fit === "contain" &&
          (backdropSrc ? (
            <Image
              src={backdropSrc}
              alt=""
              aria-hidden="true"
              fill
              sizes={sizes}
              placeholder={poster && blur ? "blur" : undefined}
              blurDataURL={poster ? blur : undefined}
              className="pointer-events-none scale-125 object-cover blur-2xl"
            />
          ) : (
            <video
              src={src}
              muted
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover blur-2xl"
            />
          ))}
        <video
          src={src}
          poster={poster ?? undefined}
          controls={controls}
          autoPlay={autoPlay}
          muted={autoPlay}
          loop={autoPlay}
          playsInline
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
      sizes={sizes}
      priority={priority}
      fit={fit}
    />
  );
}
