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
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

interface PostCardProps {
  post: InstagramPost;
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle card click for navigation
  const handleCardClick = () => {
    router.push(`/posts/${post.id}`);
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

  const handleMouseEnter = () => {
    if (post.variant !== 'video' || !videoRef.current) return;
    setIsHovered(true);
    videoRef.current.play().catch(err => {
      console.error('Error playing video:', err);
    });
  };

  const handleMouseLeave = () => {
    if (post.variant !== 'video' || !videoRef.current) return;
    setIsHovered(false);
    videoRef.current.pause();
  };

  // Auto-pause video when scrolled out of viewport or on mouse leave
  useEffect(() => {
    if (post.variant !== 'video' || !containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting && videoRef.current) {
            videoRef.current.pause();
            setIsHovered(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [post.variant]);

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
          className="relative overflow-hidden bg-background cursor-pointer"
          style={{
            aspectRatio: getAspectRatio(),
          }}
          onClick={handleCardClick}
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
                    className="object-cover"
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
            <div
              className="relative w-full h-full cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <video
                ref={videoRef}
                src={post.media?.[0]?.media || post.media?.[0]?.media_url || ''}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                poster={getThumbnailSrc()}
              />
            </div>
          ) : (
            // Single image for normal posts
            <Image
              src={getThumbnailSrc()}
              alt={`Post by ${post.user.username}`}
              fill
              className="object-cover"
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

          {/* Media Count for Carousel */}
          {post.variant === 'carousel' && post.media_count > 1 && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-foreground text-secondary-background border-2 border-border shadow-shadow">
                <Images className="w-3 h-3 mr-1" />
                {currentSlide + 1}/{post.media_count}
              </Badge>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
