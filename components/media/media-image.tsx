import Image from "next/image";
import { toBlurDataUrl } from "@/lib/format";

interface MediaImageProps {
  src: string;
  alt: string;
  blurDataUrl?: string | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function MediaImage({
  src,
  alt,
  blurDataUrl,
  className = "",
  sizes = "(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw",
  priority,
}: MediaImageProps) {
  const blur = toBlurDataUrl(blurDataUrl);
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder={blur ? "blur" : undefined}
      blurDataURL={blur}
      className={`object-cover ${className}`}
    />
  );
}
