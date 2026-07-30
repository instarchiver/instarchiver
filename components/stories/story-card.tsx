import Link from "next/link";
import type { Story } from "@/lib/api/types";
import { MediaItem } from "@/components/media/media-item";
import { Avatar } from "@/components/users/avatar";
import { formatRelativeTime } from "@/lib/format";

export function StoryCard({ story }: { story: Story }) {
  return (
    <Link
      href={`/stories/${story.story_id}`}
      className="group relative block aspect-[9/16] overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <MediaItem
        src={story.thumbnail}
        alt={`Story by ${story.user.username}`}
        blurDataUrl={story.blur_data_url}
      />
      <div className="absolute inset-x-0 top-0 flex items-center gap-2 bg-gradient-to-b from-black/60 to-transparent p-2.5">
        <Avatar src={story.user.profile_picture} alt={story.user.username} size="sm" />
        <span className="truncate text-sm font-medium text-white">
          {story.user.username}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2.5">
        <span className="text-xs text-white/80">
          {formatRelativeTime(story.story_created_at)}
        </span>
      </div>
    </Link>
  );
}
