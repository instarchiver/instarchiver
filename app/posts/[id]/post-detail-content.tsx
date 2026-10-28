"use client";

import { ViewTransition } from "react";
import Link from "next/link";
import { usePost } from "@/hooks/use-posts";
import { PostCarousel } from "@/components/posts/post-carousel";
import { SimilarPosts } from "@/components/posts/similar-posts";
import { Avatar } from "@/components/users/avatar";
import { PrivateBadge, VerifiedBadge } from "@/components/users/verified-badge";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaImage } from "@/components/media/media-image";
import type { Post } from "@/lib/api/types";
import { formatDate } from "@/lib/format";

const HERO_FRAME =
  "relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-card sm:aspect-[4/5]";
const HERO_SIZES = "(min-width: 1024px) 40vw, 100vw";

/**
 * `post` is the grid item the visitor tapped, when it is still cached. Showing
 * its thumbnail here gives the tile a target to morph into while the page loads.
 */
export function PostDetailSkeleton({ post }: { post?: Post }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-8 sm:grid-cols-2">
          {post?.thumbnail ? (
            <ViewTransition name={`post-${post.id}`} share="morph" default="none">
              <div className={HERO_FRAME}>
                <MediaImage
                  src={post.thumbnail}
                  alt=""
                  blurDataUrl={post.blur_data_url}
                  sizes={HERO_SIZES}
                  priority
                />
              </div>
            </ViewTransition>
          ) : (
            <Skeleton className="aspect-square w-full rounded-xl sm:aspect-[4/5]" />
          )}
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PostDetailContent({ id }: { id: string }) {
  const { data: post, isLoading, isError, refetch } = usePost(id);

  if (isLoading) return <PostDetailSkeleton />;

  if (isError || !post) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <ErrorState message="Couldn't load this post." onRetry={() => refetch()} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-8 sm:grid-cols-2">
          <ViewTransition name={`post-${post.id}`} share="morph" default="none">
            <PostCarousel
              media={post.media}
              fallbackSrc={post.thumbnail}
              fallbackBlur={post.blur_data_url}
              alt={post.caption ?? `Post by ${post.user.username}`}
            />
          </ViewTransition>

          <div className="flex flex-col gap-4">
            <Link
              href={`/users/${post.user.uuid}`}
              className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted"
            >
              <Avatar src={post.user.profile_picture} alt={post.user.username} />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="truncate font-medium text-foreground">
                    {post.user.username}
                  </p>
                  {post.user.is_verified && <VerifiedBadge />}
                  {post.user.is_private && <PrivateBadge />}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(post.post_created_at)}
                </p>
              </div>
            </Link>

            {post.caption && (
              <p className="whitespace-pre-line text-sm leading-6 text-foreground">
                {post.caption}
              </p>
            )}
          </div>
        </div>
      </div>

      <SimilarPosts postId={id} />
    </div>
  );
}
