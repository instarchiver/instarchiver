import { Suspense } from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getStories } from "@/lib/api/stories";
import { queryKeys } from "@/lib/query-keys";
import { CardSkeletonGrid } from "@/components/ui/skeleton";
import { COLUMNS_2_3_4_5 } from "@/components/ui/grid-columns";
import { StoriesPageContent } from "./stories-page-content";

interface StoriesPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: StoriesPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const hasSearch = typeof q === "string" && q.trim().length > 0;
  return {
    title: "Stories",
    description: "Every archived Instagram story, from every user.",
    alternates: { canonical: "/stories" },
    ...(hasSearch ? { robots: { index: false, follow: true } } : {}),
  };
}

function StoriesPageFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground">Stories</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every archived story, from every user.
      </p>
      <div className="mt-6 max-w-sm">
        <div className="min-h-11 animate-pulse rounded-lg border border-input bg-card motion-reduce:animate-none" />
      </div>
      <div className="mt-8">
        <CardSkeletonGrid
          columns={COLUMNS_2_3_4_5}
          aspectClass="aspect-[9/16]"
          showFooter={false}
        />
      </div>
    </div>
  );
}

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q : "";

  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchInfiniteQuery({
      queryKey: queryKeys.stories.list(undefined, search),
      queryFn: ({ pageParam }) => getStories(pageParam, undefined, search),
      initialPageParam: null as string | null,
    });
  } catch (error) {
    console.error("[ssr] Stories prefetch failed, falling back to client", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<StoriesPageFallback />}>
        <StoriesPageContent />
      </Suspense>
    </HydrationBoundary>
  );
}
