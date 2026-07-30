"use client";

import Link from "next/link";
import { useStory } from "@/hooks/use-stories";
import { StoryViewer } from "@/components/stories/story-viewer";
import { SimilarStories } from "@/components/stories/similar-stories";
import { Avatar } from "@/components/users/avatar";
import { PrivateBadge, VerifiedBadge } from "@/components/users/verified-badge";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";

export function StoryDetailContent({ storyId }: { storyId: string }) {
  const { data: story, isLoading, isError, refetch } = useStory(storyId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-md">
          <Skeleton className="aspect-[9/16] w-full" />
        </div>
      </div>
    );
  }

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

        <StoryViewer story={story} />
      </div>

      <SimilarStories storyId={storyId} />
    </div>
  );
}
