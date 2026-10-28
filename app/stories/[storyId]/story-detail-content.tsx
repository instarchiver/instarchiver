"use client";

import { ViewTransition } from "react";
import Link from "next/link";
import { HourglassSimple } from "@phosphor-icons/react";
import { useStory } from "@/hooks/use-stories";
import { StoryViewer } from "@/components/stories/story-viewer";
import { SimilarStories } from "@/components/stories/similar-stories";
import { Avatar } from "@/components/users/avatar";
import { PrivateBadge, VerifiedBadge } from "@/components/users/verified-badge";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaImage } from "@/components/media/media-image";
import type { Story } from "@/lib/api/types";
import { formatDate, formatStoryWindow } from "@/lib/format";

/**
 * `story` is the grid item the visitor tapped, when it is still cached. Showing
 * its thumbnail here gives the tile a target to morph into while the page loads.
 */
export function StoryDetailSkeleton({ story }: { story?: Story }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-md">
        <div className="mb-4 flex items-center gap-3 p-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        {story?.thumbnail ? (
          <ViewTransition name={`story-${story.story_id}`} share="morph" default="none">
            <div className="relative mx-auto aspect-[9/16] w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card">
              <MediaImage
                src={story.thumbnail}
                alt=""
                blurDataUrl={story.blur_data_url}
                sizes="384px"
                priority
              />
            </div>
          </ViewTransition>
        ) : (
          <Skeleton className="mx-auto aspect-[9/16] w-full max-w-sm rounded-xl" />
        )}
      </div>
    </div>
  );
}

export function StoryDetailContent({ storyId }: { storyId: string }) {
  const { data: story, isLoading, isError, refetch } = useStory(storyId);

  if (isLoading) return <StoryDetailSkeleton />;

  if (isError || !story) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-md">
          <ErrorState message="Couldn't load this story." onRetry={() => refetch()} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-md">
        <Link
          href={`/users/${story.user.uuid}`}
          className="mb-4 flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted"
        >
          <Avatar src={story.user.profile_picture} alt={story.user.username} />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <p className="truncate font-medium text-foreground">
                {story.user.username}
              </p>
              {story.user.is_verified && <VerifiedBadge />}
              {story.user.is_private && <PrivateBadge />}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDate(story.story_created_at)}
            </p>
          </div>
        </Link>

        <ViewTransition name={`story-${story.story_id}`} share="morph" default="none">
          <StoryViewer story={story} />
        </ViewTransition>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <HourglassSimple size={14} aria-hidden="true" />
          {formatStoryWindow(story.story_created_at)}
        </p>
      </div>

      <SimilarStories storyId={storyId} />
    </div>
  );
}
