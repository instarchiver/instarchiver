import { Suspense } from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPosts } from "@/lib/api/posts";
import { queryKeys } from "@/lib/query-keys";
import { CardSkeletonGrid } from "@/components/ui/skeleton";
import { COLUMNS_2_3_4_5 } from "@/components/ui/grid-columns";
import { PostsPageContent } from "./posts-page-content";

interface PostsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: PostsPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const hasSearch = typeof q === "string" && q.trim().length > 0;
  return {
    title: "Posts",
    description: "Every archived Instagram post, from every user.",
    alternates: { canonical: "/posts" },
    ...(hasSearch ? { robots: { index: false, follow: true } } : {}),
  };
}

function PostsPageFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground">Posts</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every archived post, from every user.
      </p>
      <div className="mt-6 max-w-sm">
        <div className="min-h-11 animate-pulse rounded-lg border border-input bg-card motion-reduce:animate-none" />
      </div>
      <div className="mt-8">
        <CardSkeletonGrid columns={COLUMNS_2_3_4_5} showFooter={false} />
      </div>
    </div>
  );
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q : "";

  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchInfiniteQuery({
      queryKey: queryKeys.posts.list(undefined, search),
      queryFn: ({ pageParam }) => getPosts(pageParam, undefined, search),
      initialPageParam: null as string | null,
    });
  } catch (error) {
    console.error("[ssr] Posts prefetch failed, falling back to client", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PostsPageFallback />}>
        <PostsPageContent />
      </Suspense>
    </HydrationBoundary>
  );
}
