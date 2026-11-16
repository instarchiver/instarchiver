"use client";

import { useEffect, useRef, useState } from "react";
import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import type { Story } from "@/lib/api/types";
import { isVideoUrl } from "@/lib/format";
import { MediaItem } from "@/components/media/media-item";

export function StoryViewer({ story }: { story: Story }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const isVideo = isVideoUrl(story.media);

  useEffect(() => {
    if (!isVideo) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const video = videoRef.current;
    if (video) {
      video.muted = true;
      void video.play().catch(() => {});
    }
  }, [isVideo, story.story_id]);

  const toggleMute = () => {
    const video = videoRef.current;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (video) {
      video.muted = nextMuted;
      if (!nextMuted && video.paused) {
        void video.play().catch(() => {});
      }
    }
  };

  return (
    <div className="relative mx-auto aspect-[9/16] w-[min(100%,calc((100dvh-15rem)*9/16))] max-w-sm overflow-hidden rounded-xl border border-border bg-card">
      <MediaItem
        videoRef={videoRef}
        src={story.media}
        alt={`Story by @${story.user.username}`}
        blurDataUrl={story.blur_data_url}
        poster={story.thumbnail}
        sizes="384px"
        priority
        controls
        loop={isVideo}
        muted={isMuted}
        onVolumeChange={(e) => setIsMuted(e.currentTarget.muted)}
        fit="contain"
      />
      {isVideo && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute story audio" : "Mute story audio"}
          aria-pressed={!isMuted}
          className="absolute right-2 top-2 z-10 flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full bg-black/60 px-3 text-xs font-medium text-white transition-colors hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {isMuted ? (
            <>
              <SpeakerSlash size={16} aria-hidden="true" />
              <span>Muted</span>
            </>
          ) : (
            <>
              <SpeakerHigh size={16} aria-hidden="true" />
              <span>Sound on</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
