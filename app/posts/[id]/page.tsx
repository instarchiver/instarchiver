"use client";

import { use } from "react";
import Link from "next/link";
import { usePost } from "@/hooks/use-posts";
import { PostCarousel } from "@/components/posts/post-carousel";
import { Avatar } from "@/components/users/avatar";
import { PrivateBadge, VerifiedBadge } from "@/components/users/verified-badge";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: post, isLoading, isError, refetch } = usePost(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <ErrorState message="Couldn't load this post." onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="grid gap-8 sm:grid-cols-2">
        <PostCarousel
          media={post.media}
          fallbackSrc={post.thumbnail}
          fallbackBlur={post.blur_data_url}
          alt={post.caption ?? `Post by ${post.user.username}`}
        />

        <div className="flex flex-col gap-4">
          <Link
            href={`/users/${post.user.uuid}`}
            className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted"
          >
            <Avatar src={post.user.profile_picture} alt={post.user.username} />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="truncate font-medium text-foreground">
                  {post.user.username}
                </p>
                {post.user.is_verified && <VerifiedBadge />}
                {post.user.is_private && <PrivateBadge />}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDate(post.post_created_at)}
              </p>
            </div>
          </Link>

          {post.caption && (
            <p className="whitespace-pre-line text-sm leading-6 text-foreground">
              {post.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
