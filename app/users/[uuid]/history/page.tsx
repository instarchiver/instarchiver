import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { loadUser } from "@/lib/api/server";
import { SITE_URL } from "@/lib/api/client";
import { formatUserTitle } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { JsonLd } from "@/components/json-ld";
import { UserHistoryContent } from "./user-history-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ uuid: string }>;
}): Promise<Metadata> {
  const { uuid } = await params;
  const user = await loadUser(uuid);
  if (!user) return { title: "Profile history" };
  const title = `${formatUserTitle(user)} · Profile history`;
  const description = `How @${user.username}'s Instagram profile changed over time: username, bio, follower and post counts.`;
  const images = user.profile_picture ? [user.profile_picture] : undefined;
  return {
    title,
    description,
    alternates: { canonical: `/users/${uuid}/history` },
    openGraph: {
      title,
      description,
      images,
    },
    twitter: { card: "summary", title, description, images },
  };
}

export default async function UserHistoryPage({
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
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "ProfilePage",
              url: `${SITE_URL}/users/${uuid}/history`,
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
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: SITE_URL,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Users",
                  item: `${SITE_URL}/users`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: `@${user.username}`,
                  item: `${SITE_URL}/users/${uuid}`,
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: "Profile history",
                  item: `${SITE_URL}/users/${uuid}/history`,
                },
              ],
            }}
          />
        </>
      )}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserHistoryContent uuid={uuid} />
      </HydrationBoundary>
    </>
  );
}
