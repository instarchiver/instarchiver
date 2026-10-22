import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { loadUser } from "@/lib/api/server";
import { formatCount, formatUserTitle, truncate } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { JsonLd } from "@/components/json-ld";
import { UserDetailContent } from "./user-detail-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ uuid: string }>;
}): Promise<Metadata> {
  const { uuid } = await params;
  const user = await loadUser(uuid);
  if (!user) return { title: "User" };
  const title = formatUserTitle(user);
  const bio = user.biography?.trim();
  const description = truncate(
    `${bio ? `${bio} · ` : ""}${formatCount(user.follower_count)} followers, ${formatCount(user.media_count)} posts. Archived Instagram profile of @${user.username}.`,
    160,
  );
  const images = user.profile_picture ? [user.profile_picture] : undefined;
  return {
    title,
    description,
    alternates: { canonical: `/users/${uuid}` },
    openGraph: {
      type: "profile",
      title,
      description,
      username: user.username,
      images,
    },
    twitter: { card: "summary", title, description, images },
  };
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  const user = await loadUser(uuid);
  const queryClient = new QueryClient();
  if (user) queryClient.setQueryData(queryKeys.users.detail(uuid), user);

  return (
    <>
      {user && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            dateModified: user.updated_at,
            mainEntity: {
              "@type": "Person",
              name: user.full_name || user.username,
              alternateName: `@${user.username}`,
              description: user.biography || undefined,
              image: user.profile_picture || undefined,
              sameAs: `https://www.instagram.com/${user.username}/`,
            },
          }}
        />
      )}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserDetailContent uuid={uuid} />
      </HydrationBoundary>
    </>
  );
}
