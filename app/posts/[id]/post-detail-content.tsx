"use client";

import { ViewTransition } from "react";
import Link from "next/link";
import { ArrowLeft, GridFour } from "@phosphor-icons/react";
import { usePost } from "@/hooks/use-posts";
import { ApiError } from "@/lib/api/client";
import { PostCarousel } from "@/components/posts/post-carousel";
import { SimilarPosts } from "@/components/posts/similar-posts";
import { AdSlot } from "@/components/ads/ad-slot";
import { Avatar } from "@/components/users/avatar";
import { PrivateBadge, VerifiedBadge } from "@/components/users/verified-badge";
import { EmptyState } from "@/components/ui/empty-state";
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
        <div className="mb-4 flex min-h-11 items-center">
          <Skeleton className="h-5 w-28" />
        </div>
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
                  fit="contain"
                />
              </div>
            </ViewTransition>
          ) : (
            <Skeleton className="aspect-square w-full rounded-xl sm:aspect-[4/5]" />
          )}
          <div className="flex min-w-0 flex-col gap-4">
            <div className="-mx-2 flex items-center gap-3 px-2 py-2">
              <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PostDetailContent({ id }: { id: string }) {
  const { data: post, isLoading, isError, error, refetch } = usePost(id);

  if (isLoading) return <PostDetailSkeleton />;

  const isNotFound = error instanceof ApiError && error.status === 404;

  if (isNotFound) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <EmptyState
            icon={GridFour}
            title="Post not found"
            description="This post isn't in the archive or may have been removed."
            action={
              <Link
                href="/posts"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Browse posts
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <ErrorState
            message="Couldn't load this post."
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  const itemCount = post.media.length || post.media_count || 1;
  const mediaTypeLabel =
    post.variant === "carousel"
      ? `Carousel of ${itemCount} items`
      : post.variant === "video"
        ? "Video"
        : "Single image";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/posts"
          className="-ml-2 mb-4 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to posts
        </Link>

        <h1 className="mb-6 text-xl font-semibold text-foreground sm:text-2xl">
          Archived post by @{post.user.username}
        </h1>

        <div className="grid gap-8 sm:grid-cols-2">
          <div className="sm:sticky sm:top-24 sm:self-start">
            <PostCarousel
              media={post.media}
              fallbackSrc={post.thumbnail}
              fallbackBlur={post.blur_data_url}
              alt={post.caption ?? `Post by @${post.user.username}`}
              transitionName={`post-${post.id}`}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <Link
              href={`/users/${post.user.uuid}`}
              className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Avatar src={post.user.profile_picture} alt="" />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="truncate font-medium text-foreground">
                    {post.user.username}
                  </p>
                  {post.user.is_verified && <VerifiedBadge />}
                  {post.user.is_private && <PrivateBadge />}
                </div>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {formatDate(post.post_created_at)}
                </p>
                {post.created_at && (
                  <p className="text-xs text-muted-foreground tabular-nums">
                    Archived {formatDate(post.created_at)}
                  </p>
                )}
              </div>
            </Link>

            {post.caption && (
              <p className="whitespace-pre-line break-words text-sm leading-6 text-foreground">
                {post.caption}
              </p>
            )}

            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Archive details
              </h2>
              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted-foreground">Media type</dt>
                  <dd className="font-medium tabular-nums text-foreground">
                    {mediaTypeLabel}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted-foreground">Posted on Instagram</dt>
                  <dd className="tabular-nums text-foreground">
                    {formatDate(post.post_created_at) || "—"}
                  </dd>
                </div>
                {post.created_at && (
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-muted-foreground">Archived on</dt>
                    <dd className="tabular-nums text-foreground">
                      {formatDate(post.created_at)}
                    </dd>
                  </div>
                )}
              </dl>
              <p className="mt-3 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
                Similar posts below are ranked automatically using visual and
                caption vector embeddings.
              </p>
              <Link
                href="/dmca"
                className="mt-1 inline-flex min-h-11 items-center rounded-sm text-xs text-muted-foreground transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Report or request removal
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AdSlot variant="leaderboard" className="mt-10" enabled={Boolean(post)} />

      <SimilarPosts postId={id} />
    </div>
  );
}
