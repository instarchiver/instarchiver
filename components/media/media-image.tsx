import Image from "next/image";
import { toBlurDataUrl } from "@/lib/format";

interface MediaImageProps {
  src: string;
  alt: string;
  blurDataUrl?: string | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
}

export function MediaImage({
  src,
  alt,
  blurDataUrl,
  className = "",
  sizes = "(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw",
  priority,
  fit = "cover",
}: MediaImageProps) {
  const blur = toBlurDataUrl(blurDataUrl);

  if (fit === "contain") {
    return (
      <>
        <Image
          src={src}
          alt=""
          aria-hidden="true"
          fill
          sizes={sizes}
          placeholder={blur ? "blur" : undefined}
          blurDataURL={blur}
          className="pointer-events-none scale-125 object-cover blur-2xl"
        />
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
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
      className={`object-cover ${className}`}
    />
  );
}
