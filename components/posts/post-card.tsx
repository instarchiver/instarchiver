import { memo, ViewTransition } from "react";
import { CopySimple, Play } from "@phosphor-icons/react/ssr";
import type { Post } from "@/lib/api/types";
import { truncate } from "@/lib/format";
import { MediaItem } from "@/components/media/media-item";
import { HoverPrefetchLink } from "@/components/ui/intent-link";

export const PostCard = memo(function PostCard({ post }: { post: Post }) {
  const typeLabel =
    post.variant === "video"
      ? "Video post"
      : post.variant === "carousel"
        ? "Carousel post"
        : "Post";
  const caption = post.caption?.trim();
  const label = caption
    ? `${typeLabel} by @${post.user.username}: ${truncate(caption, 80)}`
    : `${typeLabel} by @${post.user.username}`;

  return (
    <HoverPrefetchLink
      href={`/posts/${post.id}`}
      prefetch={true}
      preloadSrc={post.media?.[0]?.media}
      aria-label={label}
      className="group relative block aspect-square overflow-hidden rounded-xl border border-border bg-card transition-[translate,box-shadow] duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-0 active:shadow-none motion-reduce:hover:translate-y-0"
    >
      <ViewTransition name={`post-${post.id}`} share="morph" default="none">
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <MediaItem
            src={post.thumbnail}
            alt=""
            blurDataUrl={post.blur_data_url}
          />
        </div>
      </ViewTransition>
      {post.variant !== "normal" && (
        <div
          aria-hidden="true"
          className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
        >
          {post.variant === "video" ? (
            <Play size={14} weight="fill" />
          ) : (
            <CopySimple size={14} weight="fill" />
          )}
        </div>
      )}
    </HoverPrefetchLink>
  );
});
