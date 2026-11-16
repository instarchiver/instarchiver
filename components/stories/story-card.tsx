import { memo, ViewTransition } from "react";
import type { Story } from "@/lib/api/types";
import { MediaItem } from "@/components/media/media-item";
import { HoverPrefetchLink } from "@/components/ui/intent-link";
import { Avatar } from "@/components/users/avatar";
import { formatRelativeTime } from "@/lib/format";

export const StoryCard = memo(function StoryCard({ story }: { story: Story }) {
  const relativeTime = formatRelativeTime(story.story_created_at);
  const label = relativeTime
    ? `Story by @${story.user.username}, ${relativeTime}`
    : `Story by @${story.user.username}`;

  return (
    <HoverPrefetchLink
      href={`/stories/${story.story_id}`}
      aria-label={label}
      className="group relative block aspect-[9/16] overflow-hidden rounded-xl border border-border bg-card transition-[translate,box-shadow] duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-0 active:shadow-none motion-reduce:hover:translate-y-0"
    >
      <ViewTransition name={`story-${story.story_id}`} share="morph" default="none">
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <MediaItem
            src={story.thumbnail}
            alt=""
            blurDataUrl={story.blur_data_url}
          />
        </div>
      </ViewTransition>
      <div className="absolute inset-x-0 top-0 flex items-center gap-2 bg-gradient-to-b from-black/75 via-black/35 to-transparent p-2.5">
        <Avatar src={story.user.profile_picture} alt="" size="sm" />
        <span className="truncate text-sm font-medium text-white">
          {story.user.username}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-2.5">
        <span className="text-xs text-white" suppressHydrationWarning>
          {relativeTime}
        </span>
      </div>
    </HoverPrefetchLink>
  );
});
