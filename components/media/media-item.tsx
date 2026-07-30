import { ImageBroken } from "@phosphor-icons/react/ssr";
import { isVideoUrl } from "@/lib/format";
import { MediaImage } from "./media-image";

interface MediaItemProps {
  src: string | null | undefined;
  alt: string;
  blurDataUrl?: string | null;
  sizes?: string;
  priority?: boolean;
  controls?: boolean;
  autoPlay?: boolean;
}

export function MediaItem({
  src,
  alt,
  blurDataUrl,
  sizes,
  priority,
  controls = false,
  autoPlay = false,
}: MediaItemProps) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted">
        <ImageBroken size={28} className="text-muted-foreground" />
      </div>
    );
  }

  if (isVideoUrl(src)) {
    return (
      <video
        src={src}
        controls={controls}
        autoPlay={autoPlay}
        muted={autoPlay}
        loop={autoPlay}
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <MediaImage
      src={src}
      alt={alt}
      blurDataUrl={blurDataUrl}
      sizes={sizes}
      priority={priority}
    />
  );
}
