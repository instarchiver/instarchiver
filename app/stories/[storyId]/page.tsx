import type { Metadata } from "next";
import { getStory } from "@/lib/api/stories";
import { formatStoryTitle } from "@/lib/format";
import { StoryDetailContent } from "./story-detail-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storyId: string }>;
}): Promise<Metadata> {
  const { storyId } = await params;
  try {
    const story = await getStory(storyId);
    return { title: formatStoryTitle(story) };
  } catch {
    return { title: "Story" };
  }
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ storyId: string }>;
}) {
  const { storyId } = await params;
  return <StoryDetailContent storyId={storyId} />;
}
