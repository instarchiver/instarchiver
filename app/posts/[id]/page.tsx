'use client';

import React, { useState, useRef } from 'react';
import { usePost } from '@/hooks/usePost';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { DisqusWrapper } from '@/components/ui/disqus-wrapper';
import {
  ArrowLeft,
  Calendar,
  Image as ImageIcon,
  Video as VideoIcon,
  Images,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface PostDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

function PostDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side skeleton */}
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-lg" />
            </div>
            {/* Right side skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const { data: post, isLoading, error } = usePost(id);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const disqusConfig = post
    ? {
        url: `https://instagram-archiver.com/posts/${post.id}`,
        identifier: post.id,
        title: `Post by @${post.user.username}`,
      }
    : undefined;

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? (post?.media.length || 1) - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev === (post?.media.length || 1) - 1 ? 0 : prev + 1));
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
        });
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const getVariantIcon = () => {
    switch (post?.variant) {
      case 'video':
        return <VideoIcon className="w-4 h-4" />;
      case 'carousel':
        return <Images className="w-4 h-4" />;
      default:
        return <ImageIcon className="w-4 h-4" />;
    }
  };

  const getVariantColor = () => {
    switch (post?.variant) {
      case 'video':
        return 'bg-chart-4 text-main-foreground';
      case 'carousel':
        return 'bg-chart-2 text-main-foreground';
      default:
        return 'bg-chart-1 text-main-foreground';
    }
  };

  if (isLoading) {
    return <PostDetailSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto px-4 py-8">
          <Card className="w-full max-w-2xl mx-auto border-2 border-border shadow-shadow">
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold text-foreground mb-4">Error Loading Post</h1>
              <p className="text-lg text-foreground/60 mb-4">
                Failed to load post details. The post may have been deleted or the ID is invalid.
              </p>
              <Link href="/posts">
                <Button>Back to Posts</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link href="/posts">
            <Button variant="neutral" className="mb-6 border-2 border-border shadow-shadow">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Posts
            </Button>
          </Link>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Side - Media */}
            <div className="space-y-4">
              <Card className="border-2 border-border shadow-shadow overflow-hidden">
                {/* Media Display */}
                <div className="relative bg-background" style={{ aspectRatio: '1 / 1' }}>
                  {post.variant === 'carousel' && post.media && post.media.length > 0 ? (
                    // Carousel
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
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority={index === 0}
                          />
                        </div>
                      ))}

                      {/* Carousel Controls */}
                      {post.media.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevSlide}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-foreground/80 hover:bg-foreground text-secondary-background rounded-full p-2 border-2 border-border shadow-shadow transition-all z-10"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>

                          <button
                            onClick={handleNextSlide}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-foreground/80 hover:bg-foreground text-secondary-background rounded-full p-2 border-2 border-border shadow-shadow transition-all z-10"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>

                          {/* Slide Indicators */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                            {post.media.map((_, index) => (
                              <div
                                key={index}
                                className={`w-2 h-2 rounded-full border border-border transition-all duration-200 ${
                                  index === currentSlide ? 'bg-foreground w-6' : 'bg-foreground/40'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : post.variant === 'video' ? (
                    // Video
                    <div
                      className="relative w-full h-full cursor-pointer"
                      onClick={handleVideoClick}
                    >
                      <video
                        ref={videoRef}
                        src={post.media?.[0]?.media_url || post.media?.[0]?.media || ''}
                        className="w-full h-full object-cover"
                        loop
                        muted={isMuted}
                        playsInline
                        poster={post.thumbnail || post.thumbnail_url}
                      />
                      {/* Play/Pause Overlay */}
                      <div
                        className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-200 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
                      >
                        <div className="bg-foreground/80 rounded-full p-6 border-2 border-border shadow-shadow">
                          {isPlaying ? (
                            <svg
                              className="w-10 h-10 text-secondary-background"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                          ) : (
                            <svg
                              className="w-10 h-10 text-secondary-background"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </div>
                      </div>
                      {/* Mute Button */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          toggleMute();
                        }}
                        className="absolute top-4 left-4 bg-foreground/80 hover:bg-foreground text-secondary-background rounded-full p-2 border-2 border-border shadow-shadow transition-all z-10"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  ) : (
                    // Single Image
                    <Image
                      src={post.thumbnail || post.thumbnail_url}
                      alt={`Post by ${post.user.username}`}
                      fill
                      className="object-cover"
                      placeholder={post.blur_data_url ? 'blur' : 'empty'}
                      blurDataURL={
                        post.blur_data_url
                          ? `data:image/png;base64,${post.blur_data_url}`
                          : undefined
                      }
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  )}

                  {/* Variant Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge
                      className={`${getVariantColor()} border-2 border-border shadow-shadow flex items-center gap-1.5 px-3 py-1.5`}
                    >
                      {getVariantIcon()}
                      <span className="capitalize text-sm font-bold">
                        {post.variant === 'normal' ? 'Image' : post.variant}
                      </span>
                    </Badge>
                  </div>

                  {/* Media Count for Carousel */}
                  {post.variant === 'carousel' && post.media_count > 1 && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-foreground text-secondary-background border-2 border-border shadow-shadow px-3 py-1.5">
                        <Images className="w-4 h-4 mr-1.5" />
                        <span className="text-sm font-bold">
                          {currentSlide + 1}/{post.media_count}
                        </span>
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Side - Info & Comments */}
            <div className="space-y-6">
              {/* Post Info Card */}
              <Card className="border-2 border-border shadow-shadow">
                <CardContent className="p-6">
                  {/* User Info */}
                  <Link href={`/users/${post.user.uuid}`}>
                    <div className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity">
                      <div className="w-14 h-14 rounded-full border-2 border-border overflow-hidden bg-background relative">
                        <Image
                          src={post.user.profile_picture}
                          alt={post.user.username}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-bold text-foreground truncate">
                          @{post.user.username}
                        </p>
                        <p className="text-sm text-foreground/60 truncate">{post.user.full_name}</p>
                      </div>
                    </div>
                  </Link>

                  {/* Caption */}
                  {post.caption && (
                    <div className="mb-4 pb-4 border-b-2 border-border">
                      <p className="text-foreground whitespace-pre-wrap break-words">
                        {post.caption}
                      </p>
                    </div>
                  )}

                  {/* Post Details */}
                  <div className="space-y-3">
                    {post.post_created_at && !isNaN(new Date(post.post_created_at).getTime()) ? (
                      <>
                        <div className="flex items-center gap-2 text-sm text-foreground/60">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">
                            Posted{' '}
                            {formatDistanceToNow(new Date(post.post_created_at), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <div className="text-xs text-foreground/40">
                          {format(new Date(post.post_created_at), 'PPpp')}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-foreground/60">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">Date unknown</span>
                      </div>
                    )}
                  </div>

                  {/* View Profile Button */}
                  <div className="mt-6">
                    <Link href={`/users/${post.user.uuid}`}>
                      <Button variant="neutral" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Disqus Comments */}
              <Card className="border-2 border-border shadow-shadow">
                <CardContent className="p-0">
                  {disqusConfig && (
                    <DisqusWrapper shortname="instagram-archiver" config={disqusConfig} />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
