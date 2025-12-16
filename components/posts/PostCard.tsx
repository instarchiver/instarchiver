'use client';

import { InstagramPost } from '@/app/types/instagram';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon, Video, Images, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';

interface PostCardProps {
  post: InstagramPost;
}

export function PostCard({ post }: PostCardProps) {
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

  return (
    <Card className="group overflow-hidden border-2 border-border shadow-shadow hover:shadow-[4px_4px_0px_0px_var(--border)] transition-all duration-200 bg-secondary-background">
      {/* Thumbnail */}
      <div className="relative aspect-square overflow-hidden bg-background">
        <Image
          src={getThumbnailSrc()}
          alt={`Post by ${post.user.username}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          placeholder={post.blur_data_url ? 'blur' : 'empty'}
          blurDataURL={post.blur_data_url || undefined}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />

        {/* Variant Badge */}
        <div className="absolute top-2 right-2">
          <Badge
            className={`${getVariantColor()} border-2 border-border shadow-shadow flex items-center gap-1`}
          >
            {getVariantIcon()}
            <span className="capitalize text-xs font-bold">{post.variant}</span>
          </Badge>
        </div>

        {/* Media Count for Carousel */}
        {post.variant === 'carousel' && post.media_count > 1 && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-foreground text-secondary-background border-2 border-border shadow-shadow">
              <Images className="w-3 h-3 mr-1" />
              {post.media_count}
            </Badge>
          </div>
        )}
      </div>

      {/* Post Info */}
      <div className="p-4 space-y-3">
        {/* User Info */}
        <Link
          href={`/users/${post.user.username}`}
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
          <span>{formatDistanceToNow(new Date(post.post_created_at), { addSuffix: true })}</span>
        </div>
      </div>
    </Card>
  );
}
