import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { loadPost } from "@/lib/api/server";
import { formatPostTitle, formatUserTitle, truncate } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { JsonLd } from "@/components/json-ld";
import { PostDetailContent } from "./post-detail-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await loadPost(id);
  const title = formatPostTitle(post);
  const caption = post.caption?.trim();
  const description = caption
    ? truncate(caption, 160)
    : `Archived Instagram post by ${formatUserTitle(post.user)}.`;
  const images = post.thumbnail ? [post.thumbnail] : undefined;
  return {
    title,
    description,
    alternates: { canonical: `/posts/${id}` },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: post.post_created_at,
      authors: [`/users/${post.user.uuid}`],
      images,
    },
    twitter: { title, description, images },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await loadPost(id);
  const queryClient = new QueryClient();
  queryClient.setQueryData(queryKeys.posts.detail(id), post);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SocialMediaPosting",
          headline: formatPostTitle(post),
          articleBody: post.caption || undefined,
          datePublished: post.post_created_at,
          dateModified: post.updated_at,
          image: post.thumbnail || undefined,
          author: {
            "@type": "Person",
            name: post.user.full_name || post.user.username,
            alternateName: `@${post.user.username}`,
          },
        }}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostDetailContent id={id} />
      </HydrationBoundary>
    </>
  );
}
