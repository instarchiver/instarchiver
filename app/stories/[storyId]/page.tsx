import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { loadStory } from "@/lib/api/server";
import { formatDate, formatStoryTitle, formatUserTitle } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { JsonLd } from "@/components/json-ld";
import { StoryDetailContent } from "./story-detail-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storyId: string }>;
}): Promise<Metadata> {
  const { storyId } = await params;
  const story = await loadStory(storyId);
  if (!story) return { title: "Story" };
  const title = formatStoryTitle(story);
  const description = `Archived Instagram story by ${formatUserTitle(story.user)}, posted ${formatDate(story.story_created_at)}.`;
  const images = story.thumbnail ? [story.thumbnail] : undefined;
  return {
    title,
    description,
    alternates: { canonical: `/stories/${storyId}` },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: story.story_created_at,
      images,
    },
    twitter: { title, description, images },
  };
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ storyId: string }>;
}) {
  const { storyId } = await params;
  const story = await loadStory(storyId);
  const queryClient = new QueryClient();
  if (story) queryClient.setQueryData(queryKeys.stories.detail(storyId), story);

  return (
    <>
      {story && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "SocialMediaPosting",
            headline: formatStoryTitle(story),
            datePublished: story.story_created_at,
            image: story.thumbnail || undefined,
            author: {
              "@type": "Person",
              name: story.user.full_name || story.user.username,
              alternateName: `@${story.user.username}`,
            },
          }}
        />
      )}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <StoryDetailContent storyId={storyId} />
      </HydrationBoundary>
    </>
  );
}
