"use client";

import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import type { Story } from "@/lib/api/types";
import { findCachedItem } from "@/lib/cached-item";
import { StoryDetailSkeleton } from "./story-detail-content";

export default function Loading() {
  const { storyId } = useParams<{ storyId: string }>();
  const story = findCachedItem<Story>(
    useQueryClient(),
    "stories",
    (s) => s.story_id === storyId
  );
  return <StoryDetailSkeleton story={story} />;
}
