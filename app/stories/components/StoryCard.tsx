'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

import { InstagramStory } from '@/app/types/instagram/story';

interface StoryCardProps {
  story: InstagramStory;
  onPreview?: (story: InstagramStory) => void;
}

// Custom event to ensure only one video plays at a time
const VIDEO_PLAY_EVENT = 'story-video-play';

export function StoryCard({ story, onPreview }: StoryCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  // Check if media is a video
  const isVideo = (mediaUrl: string) => {
    return mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.mov');
  };

  const mediaIsVideo = isVideo(story.media);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Handler for when another video starts playing
    const handleOtherVideoPlay = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.videoElement !== video) {
        video.pause();
        setIsHovered(false);
        setIsTouched(false);
      }
    };

    // Listen for other videos playing
    window.addEventListener(VIDEO_PLAY_EVENT, handleOtherVideoPlay);

    return () => {
      window.removeEventListener(VIDEO_PLAY_EVENT, handleOtherVideoPlay);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!mediaIsVideo || !videoRef.current) return;
    setIsHovered(true);
    playVideo();
  };

  const handleMouseLeave = () => {
    if (!mediaIsVideo || !videoRef.current) return;
    setIsHovered(false);
    videoRef.current.pause();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!mediaIsVideo || !videoRef.current) return;

    // Prevent default to avoid triggering link navigation immediately
    if (!videoRef.current.paused) {
      e.preventDefault();
      setIsTouched(false);
      videoRef.current.pause();
    } else {
      e.preventDefault();
      setIsTouched(true);
      playVideo();
    }
  };

  const playVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    // Dispatch event to pause other videos
    window.dispatchEvent(
      new CustomEvent(VIDEO_PLAY_EVENT, {
        detail: { videoElement: video },
      })
    );

    // Play the video
    video.play().catch(error => {
      console.error('Error playing video:', error);
    });
  };

  return (
    <Card className="w-full shadow-[var(--shadow)] bg-[var(--background)] mb-4 sm:mb-6">
      {/* Full-width media section - no padding */}
      <Link
        href={`/stories/${story.story_id}`}
        onClick={e => {
          // On mobile, if video is playing, prevent navigation on first click
          if (isTouched && videoRef.current && !videoRef.current.paused) {
            e.preventDefault();
          }
        }}
      >
        <div
          className="relative w-full border-t-2 border-[var(--border)] aspect-[9/16] cursor-pointer hover:opacity-90 transition-opacity"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
        >
          {mediaIsVideo ? (
            <video
              ref={videoRef}
              src={story.media}
              poster={story.thumbnail}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              preload="metadata"
            />
          ) : (
            <Image
              src={story.thumbnail}
              alt="Story thumbnail"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              priority
              blurDataURL={`data:image/png;base64,${story.blur_data_url}`}
              placeholder={story.blur_data_url ? 'blur' : 'empty'}
            />
          )}
        </div>
      </Link>
    </Card>
  );
}
