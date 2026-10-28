import { ViewTransition } from "react";
import Link from "next/link";
import { CopySimple, Play } from "@phosphor-icons/react/ssr";
import type { Post } from "@/lib/api/types";
import { MediaItem } from "@/components/media/media-item";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="group relative block aspect-square overflow-hidden rounded-xl border border-border bg-card transition-[translate,box-shadow] duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-none motion-reduce:hover:translate-y-0"
    >
      <ViewTransition name={`post-${post.id}`} share="morph" default="none">
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <MediaItem
            src={post.thumbnail}
            alt={post.caption ?? `Post by ${post.user.username}`}
            blurDataUrl={post.blur_data_url}
          />
        </div>
      </ViewTransition>
      {post.variant !== "normal" && (
        <div className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white">
          {post.variant === "video" ? (
            <Play size={14} weight="fill" />
          ) : (
            <CopySimple size={14} weight="fill" />
          )}
        </div>
      )}
    </Link>
  );
}
