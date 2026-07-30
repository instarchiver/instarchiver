import { Suspense } from "react";
import type { Metadata } from "next";
import { StoriesPageContent } from "./stories-page-content";

export const metadata: Metadata = {
  title: "Stories",
};

function StoriesPageFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground">Stories</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every archived story, from every user.
      </p>
      <div className="mt-8">
        <div className="min-h-11 animate-pulse rounded-lg border border-border bg-card" />
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
