import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { loadPost } from "@/lib/api/server";
import { formatPostTitle, formatUserTitle, truncate } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { SITE_URL } from "@/lib/api/client";
import { JsonLd } from "@/components/json-ld";
import { PostDetailContent } from "./post-detail-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await loadPost(id);
  if (!post) return { title: "Post" };
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
  if (post) queryClient.setQueryData(queryKeys.posts.detail(id), post);

  return (
    <>
      {post && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "SocialMediaPosting",
            url: `${SITE_URL}/posts/${id}`,
            headline: formatPostTitle(post),
            articleBody: post.caption || undefined,
            datePublished: post.post_created_at,
            dateModified: post.updated_at,
            image: post.thumbnail || undefined,
            author: {
              "@type": "Person",
              name: post.user.full_name || post.user.username,
              alternateName: `@${post.user.username}`,
              url: `${SITE_URL}/users/${post.user.uuid}`,
            },
          }}
        />
      )}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostDetailContent id={id} />
      </HydrationBoundary>
    </>
  );
}
