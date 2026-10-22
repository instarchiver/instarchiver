import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { loadUser } from "@/lib/api/server";
import { formatUserTitle } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
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
  return {
    title,
    description,
    alternates: { canonical: `/users/${uuid}/history` },
    openGraph: {
      title,
      description,
      images: user.profile_picture || undefined,
    },
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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserHistoryContent uuid={uuid} />
    </HydrationBoundary>
  );
}
