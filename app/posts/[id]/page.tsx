import type { Metadata } from "next";
import { getPost } from "@/lib/api/posts";
import { formatPostTitle } from "@/lib/format";
import { PostDetailContent } from "./post-detail-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = await getPost(id);
    return { title: formatPostTitle(post) };
  } catch {
    return { title: "Post" };
  }
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PostDetailContent id={id} />;
}
