import type { Story } from "@/lib/api/types";
import { MediaItem } from "@/components/media/media-item";

export function StoryViewer({ story }: { story: Story }) {
  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card">
      <MediaItem
        src={story.media}
        alt={`Story by ${story.user.username}`}
        blurDataUrl={story.blur_data_url}
        sizes="384px"
        priority
        controls
        autoPlay
      />
    </div>
  );
}
