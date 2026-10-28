"use client";

import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import type { Post } from "@/lib/api/types";
import { findCachedItem } from "@/lib/cached-item";
import { PostDetailSkeleton } from "./post-detail-content";

export default function Loading() {
  const { id } = useParams<{ id: string }>();
  const post = findCachedItem<Post>(useQueryClient(), "posts", (p) => p.id === id);
  return <PostDetailSkeleton post={post} />;
}
