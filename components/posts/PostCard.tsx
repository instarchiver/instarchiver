'use client';

import { InstagramPost } from '@/app/types/instagram';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Image as ImageIcon,
  Video,
  Images,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  ExternalLink,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useVideoPlayback } from '@/contexts/VideoPlaybackContext';

interface PostCardProps {
  post: InstagramPost;
}

export function PostCard({ post }: PostCardProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentlyPlayingId, setCurrentlyPlaying, isMuted, toggleMute } = useVideoPlayback();

  // Sync video muted state with context
  useEffect(() => {
    if (videoRef.current && post.variant === 'video') {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, post.variant]);

  const getVariantIcon = () => {
    switch (post.variant) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'carousel':
        return <Images className="w-4 h-4" />;
      default:
        return <ImageIcon className="w-4 h-4" />;
    }
  };

  const getVariantColor = () => {
    switch (post.variant) {
      case 'video':
        return 'bg-chart-4 text-main-foreground';
      case 'carousel':
        return 'bg-chart-2 text-main-foreground';
      default:
        return 'bg-chart-1 text-main-foreground';
    }
  };

  // Use thumbnail if available, otherwise fallback to thumbnail_url
  const getThumbnailSrc = () => {
    return post.thumbnail || post.thumbnail_url;
  };

  // Get current image source for carousel
  const getCurrentImageSrc = () => {
    if (post.variant === 'carousel' && post.media && post.media.length > 0) {
      const currentMedia = post.media[currentSlide];
      return currentMedia.thumbnail || currentMedia.thumbnail_url;
    }
    return getThumbnailSrc();
  };

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide(prev => (prev === 0 ? post.media.length - 1 : prev - 1));
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide(prev => (prev === post.media.length - 1 ? 0 : prev + 1));
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (post.variant === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setCurrentlyPlaying(null);
      } else {
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
        });
        setIsPlaying(true);
        setCurrentlyPlaying(post.id);
      }
    }
  };

  const handleMuteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMute();
  };

  // Pause this video if another video starts playing
  useEffect(() => {
    if (post.variant === 'video' && currentlyPlayingId !== post.id && isPlaying) {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [currentlyPlayingId, post.id, post.variant, isPlaying]);

  // Auto-pause video when scrolled out of viewport
  useEffect(() => {
    if (post.variant !== 'video' || !containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting && videoRef.current && isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
            setCurrentlyPlaying(null);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [post.variant, isPlaying, setCurrentlyPlaying]);

  // Get aspect ratio - prefer media dimensions over post dimensions
  const getAspectRatio = () => {
    // For videos and carousels, use the first media item's dimensions
    if (post.media && post.media.length > 0 && post.media[0].width && post.media[0].height) {
      return `${post.media[0].width} / ${post.media[0].height}`;
    }
    // Fallback to post dimensions
    if (post.width && post.height) {
      return `${post.width} / ${post.height}`;
    }
    // Default to square
    return '1 / 1';
  };

  return (
    <div className="break-inside-avoid mb-4 sm:mb-6">
      <Card className="group overflow-hidden border-2 border-border shadow-shadow hover:shadow-[4px_4px_0px_0px_var(--border)] transition-all duration-200 bg-secondary-background">
        {/* Thumbnail */}
        <div
          ref={containerRef}
          className="relative overflow-hidden bg-background"
          style={{
            aspectRatio: getAspectRatio(),
          }}
          onClick={post.variant === 'video' ? handleVideoClick : undefined}
        >
          {post.variant === 'carousel' && post.media && post.media.length > 0 ? (
            // Carousel with smooth transitions
            <div className="relative w-full h-full">
              {post.media.map((media, index) => (
                <div
                  key={media.id}
                  className="absolute inset-0 transition-all duration-500 ease-in-out"
                  style={{
                    opacity: index === currentSlide ? 1 : 0,
                    transform: `translateX(${(index - currentSlide) * 100}%)`,
                    pointerEvents: index === currentSlide ? 'auto' : 'none',
                  }}
                >
                  <Image
                    src={media.thumbnail || media.thumbnail_url}
                    alt={`Post by ${post.user.username} - Image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    placeholder={media.blur_data_url ? 'blur' : 'empty'}
                    blurDataURL={
                      media.blur_data_url
                        ? `data:image/png;base64,${media.blur_data_url}`
                        : undefined
                    }
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          ) : post.variant === 'video' ? (
            // Video element for video posts
            <div className="relative w-full h-full cursor-pointer">
              <video
                ref={videoRef}
                src={post.media?.[0]?.media || post.media?.[0]?.media_url || ''}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loop
                muted={isMuted}
                playsInline
                poster={getThumbnailSrc()}
              />
              {/* Play/Pause Overlay */}
              <div
                className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-200 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
              >
                <div className="bg-foreground/80 rounded-full p-4 border-2 border-border shadow-shadow">
                  {isPlaying ? (
                    <svg
                      className="w-8 h-8 text-secondary-background"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-8 h-8 text-secondary-background"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </div>
              </div>
              {/* Mute/Unmute Button */}
              <button
                onClick={handleMuteClick}
                className="absolute top-2 left-2 bg-foreground/80 hover:bg-foreground text-secondary-background rounded-full p-2 border-2 border-border shadow-shadow transition-all duration-200 z-10"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            // Single image for normal posts
            <Image
              src={getThumbnailSrc()}
              alt={`Post by ${post.user.username}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              placeholder={post.blur_data_url ? 'blur' : 'empty'}
              blurDataURL={
                post.blur_data_url ? `data:image/png;base64,${post.blur_data_url}` : undefined
              }
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          )}

          {/* Carousel Navigation */}
          {post.variant === 'carousel' && post.media && post.media.length > 1 && (
            <>
              {/* Previous Button */}
              <button
                onClick={handlePrevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-foreground/80 hover:bg-foreground text-secondary-background rounded-full p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 border-2 border-border shadow-shadow z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-foreground/80 hover:bg-foreground text-secondary-background rounded-full p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 border-2 border-border shadow-shadow z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {post.media.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full border border-border transition-all duration-200 ${
                      index === currentSlide ? 'bg-foreground w-4' : 'bg-foreground/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Variant Badge */}
          <div className="absolute top-2 right-2">
            <Badge
              className={`${getVariantColor()} border-2 border-border shadow-shadow flex items-center gap-1`}
            >
              {getVariantIcon()}
              <span className="capitalize text-xs font-bold">
                {post.variant === 'normal' ? 'Image' : post.variant}
              </span>
            </Badge>
          </div>

          {/* Media Count for Carousel */}
          {post.variant === 'carousel' && post.media_count > 1 && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-foreground text-secondary-background border-2 border-border shadow-shadow">
                <Images className="w-3 h-3 mr-1" />
                {currentSlide + 1}/{post.media_count}
              </Badge>
            </div>
          )}

          {/* View Details Button */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Link href={`/posts/${post.id}`}>
              <Button
                variant="default"
                size="sm"
                className="gap-1.5 bg-foreground/60 hover:bg-foreground/80 text-secondary-background border border-border/50 shadow-sm backdrop-blur-sm"
              >
                View Details
                <ExternalLink className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Post Info */}
        <div className="p-4 space-y-3">
          {/* User Info */}
          <Link
            href={`/users/${post.user.uuid}`}
            className="flex items-center gap-2 group/user hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full border-2 border-border overflow-hidden bg-background relative">
              <Image
                src={post.user.profile_picture}
                alt={post.user.username}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{post.user.username}</p>
              <p className="text-xs text-foreground/60 truncate">{post.user.full_name}</p>
            </div>
          </Link>

          {/* Post Date */}
          <div className="flex items-center gap-2 text-xs text-foreground/60">
            <Calendar className="w-3 h-3" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help">
                    {formatDistanceToNow(new Date(post.post_created_at), { addSuffix: true })}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{format(new Date(post.post_created_at), 'PPpp')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </Card>
    </div>
  );
}
