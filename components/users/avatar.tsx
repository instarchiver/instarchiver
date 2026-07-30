import Image from "next/image";
import { User } from "@phosphor-icons/react/ssr";

const SIZE_CLASSES = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-24 w-24",
};

export function Avatar({
  src,
  alt,
  size = "md",
}: {
  src: string | null | undefined;
  alt: string;
  size?: keyof typeof SIZE_CLASSES;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-muted ${SIZE_CLASSES[size]}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="96px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <User size={size === "lg" ? 40 : 20} />
        </div>
      )}
    </div>
  );
}
