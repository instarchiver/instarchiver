import type { Metadata } from "next";
import { getUser } from "@/lib/api/users";
import { formatUserTitle } from "@/lib/format";
import { UserHistoryContent } from "./user-history-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ uuid: string }>;
}): Promise<Metadata> {
  const { uuid } = await params;
  try {
    const user = await getUser(uuid);
    return { title: `${formatUserTitle(user)} · Profile history` };
  } catch {
    return { title: "Profile history" };
  }
}

export default async function UserHistoryPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <UserHistoryContent uuid={uuid} />;
}
