"use client";

import { ViewTransition } from "react";
import Link from "next/link";
import { ArrowLeft, CirclesFour, HourglassSimple } from "@phosphor-icons/react";
import { useStory } from "@/hooks/use-stories";
import { ApiError } from "@/lib/api/client";
import { StoryViewer } from "@/components/stories/story-viewer";
import { SimilarStories } from "@/components/stories/similar-stories";
import { AdSlot } from "@/components/ads/ad-slot";
import { Avatar } from "@/components/users/avatar";
import { PrivateBadge, VerifiedBadge } from "@/components/users/verified-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaImage } from "@/components/media/media-image";
import type { Story } from "@/lib/api/types";
import {
  formatDate,
  formatStoryWindow,
  isVideoUrl,
} from "@/lib/format";

const STORY_FRAME =
  "relative mx-auto aspect-[9/16] w-[min(100%,calc((100dvh-15rem)*9/16))] max-w-sm overflow-hidden rounded-xl border border-border bg-card";

/**
 * `story` is the grid item the visitor tapped, when it is still cached. Showing
 * its thumbnail here gives the tile a target to morph into while the page loads.
 */
export function StoryDetailSkeleton({ story }: { story?: Story }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-md">
        <div className="mb-4 flex min-h-11 items-center">
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="-mx-2 mb-4 flex items-center gap-3 px-2 py-2">
          <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        {story?.thumbnail ? (
          <ViewTransition
            name={`story-${story.story_id}`}
            share="morph"
            default="none"
          >
            <div className={STORY_FRAME}>
              <MediaImage
                src={story.thumbnail}
                alt=""
                blurDataUrl={story.blur_data_url}
                sizes="384px"
                priority
                fit="contain"
              />
            </div>
          </ViewTransition>
        ) : (
          <Skeleton className="mx-auto aspect-[9/16] w-[min(100%,calc((100dvh-15rem)*9/16))] max-w-sm rounded-xl" />
        )}
      </div>
    </div>
  );
}

export function StoryDetailContent({ storyId }: { storyId: string }) {
  const { data: story, isLoading, isError, error, refetch } = useStory(storyId);

  if (isLoading) return <StoryDetailSkeleton />;

  const isNotFound = error instanceof ApiError && error.status === 404;

  if (isNotFound) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-md">
          <EmptyState
            icon={CirclesFour}
            title="Story not found"
            description="This story isn't in the archive or may have been removed."
            action={
              <Link
                href="/stories"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Browse stories
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  if (isError || !story) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-md">
          <ErrorState
            message="Couldn't load this story."
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  const mediaTypeLabel = isVideoUrl(story.media) ? "Video story" : "Photo story";
  const windowStatus = formatStoryWindow(story.story_created_at);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-md">
        <Link
          href="/stories"
          className="-ml-2 mb-4 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to stories
        </Link>

        <h1 className="mb-4 text-xl font-semibold text-foreground">
          Archived story by @{story.user.username}
        </h1>

        <Link
          href={`/users/${story.user.uuid}?tab=stories`}
          className="-mx-2 mb-4 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Avatar src={story.user.profile_picture} alt="" />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <p className="truncate font-medium text-foreground">
                {story.user.username}
              </p>
              {story.user.is_verified && <VerifiedBadge />}
              {story.user.is_private && <PrivateBadge />}
            </div>
            <p className="text-xs text-muted-foreground tabular-nums">
              {formatDate(story.story_created_at)}
            </p>
            {story.created_at && (
              <p className="text-xs text-muted-foreground tabular-nums">
                Archived {formatDate(story.created_at)}
              </p>
            )}
          </div>
        </Link>

        <ViewTransition
          name={`story-${story.story_id}`}
          share="morph"
          default="none"
        >
          <StoryViewer story={story} />
        </ViewTransition>
        <p
          suppressHydrationWarning
          className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"
        >
          <HourglassSimple size={14} aria-hidden="true" />
          {windowStatus}
        </p>

        <div className="mt-6 rounded-xl border border-border bg-card p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Archive details
          </h2>
          <dl className="mt-3 space-y-2 text-xs">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">Media type</dt>
              <dd className="font-medium text-foreground">{mediaTypeLabel}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">24-hour window</dt>
              <dd
                suppressHydrationWarning
                className="text-right tabular-nums text-foreground"
              >
                {windowStatus || "—"}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">Posted on Instagram</dt>
              <dd className="tabular-nums text-foreground">
                {formatDate(story.story_created_at) || "—"}
              </dd>
            </div>
            {story.created_at && (
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-muted-foreground">Archived on</dt>
                <dd className="tabular-nums text-foreground">
                  {formatDate(story.created_at)}
                </dd>
              </div>
            )}
          </dl>
          <p className="mt-3 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
            Similar stories below are ranked automatically using visual vector
            embeddings.
          </p>
          <Link
            href="/dmca"
            className="mt-1 inline-flex min-h-11 items-center rounded-sm text-xs text-muted-foreground transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Report or request removal
          </Link>
        </div>
      </div>

      <AdSlot variant="leaderboard" className="mt-8" enabled={Boolean(story)} />

      <SimilarStories storyId={storyId} />
    </div>
  );
}
