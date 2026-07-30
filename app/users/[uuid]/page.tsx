import type { Metadata } from "next";
import { getUser } from "@/lib/api/users";
import { formatUserTitle } from "@/lib/format";
import { UserDetailContent } from "./user-detail-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ uuid: string }>;
}): Promise<Metadata> {
  const { uuid } = await params;
  try {
    const user = await getUser(uuid);
    return { title: formatUserTitle(user) };
  } catch {
    return { title: "User" };
  }
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <UserDetailContent uuid={uuid} />;
}
