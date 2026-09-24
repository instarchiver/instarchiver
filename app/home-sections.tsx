"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { useStatistics } from "@/hooks/use-stats";
import { useRecentPosts } from "@/hooks/use-posts";
import { useRecentStories } from "@/hooks/use-stories";
import type { SiteStatistics } from "@/lib/api/types";
import { formatCount } from "@/lib/format";
import { PostCard } from "@/components/posts/post-card";
import { StoryCard } from "@/components/stories/story-card";
import { CardSkeletonGrid } from "@/components/ui/skeleton";
import { COLUMNS_2_3_4_5 } from "@/components/ui/grid-columns";

const RECENT_LIMIT = 20;

export function StatCount({ statKey }: { statKey: keyof SiteStatistics }) {
  const { data } = useStatistics();

  return (
    <p className="text-2xl font-semibold tabular-nums text-foreground">
      {data ? formatCount(data[statKey]) : "—"}
    </p>
  );
}

function RecentSection({
  title,
  href,
  isLoading,
  children,
}: {
  title: string;
  href: string;
  isLoading: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>
      {isLoading ? (
        <div className="mt-6">
          <CardSkeletonGrid count={10} />
        </div>
      ) : (
        <div className={`mt-6 grid gap-4 ${COLUMNS_2_3_4_5.className}`}>
          {children}
        </div>
      )}
    </section>
  );
}

export function RecentStories() {
  const { data, isLoading } = useRecentStories();
  const stories = data?.results.slice(0, RECENT_LIMIT) ?? [];

  if (!isLoading && stories.length === 0) return null;

  return (
    <RecentSection
      title="Recently Archived Stories"
      href="/stories"
      isLoading={isLoading}
    >
      {stories.map((story) => (
        <StoryCard key={story.story_id} story={story} />
      ))}
    </RecentSection>
  );
}

export function RecentPosts() {
  const { data, isLoading } = useRecentPosts();
  const posts = data?.results.slice(0, RECENT_LIMIT) ?? [];

  if (!isLoading && posts.length === 0) return null;

  return (
    <RecentSection
      title="Recently Archived Posts"
      href="/posts"
      isLoading={isLoading}
    >
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </RecentSection>
  );
}
