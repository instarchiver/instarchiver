import { Suspense } from "react";
import type { Metadata } from "next";
import { CardSkeletonGrid } from "@/components/ui/skeleton";
import { COLUMNS_2_3_4_5 } from "@/components/ui/grid-columns";
import { StoriesPageContent } from "./stories-page-content";

export const metadata: Metadata = {
  title: "Stories",
  description: "Every archived Instagram story, from every user.",
  alternates: { canonical: "/stories" },
};

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

export default function StoriesPage() {
  return (
    <Suspense fallback={<StoriesPageFallback />}>
      <StoriesPageContent />
    </Suspense>
  );
}
