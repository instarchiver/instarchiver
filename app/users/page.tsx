import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getFrontendSettings } from "@/lib/api/settings";
import { getUsers } from "@/lib/api/users";
import { queryKeys } from "@/lib/query-keys";
import { UsersPageContent } from "./users-page-content";

const DEFAULT_USER_ORDERING = "-created_at";

interface UsersPageProps {
  searchParams: Promise<{ q?: string; ordering?: string }>;
}

export async function generateMetadata({
  searchParams,
}: UsersPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const hasSearch = typeof q === "string" && q.trim().length > 0;
  return {
    title: "Users",
    description: "Browse and search archived Instagram profiles.",
    alternates: { canonical: "/users" },
    ...(hasSearch ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q : "";
  const ordering =
    typeof params.ordering === "string" && params.ordering
      ? params.ordering
      : DEFAULT_USER_ORDERING;

  const queryClient = new QueryClient();
  const [frontendSettings] = await Promise.all([
    getFrontendSettings().catch((error) => {
      console.error(
        "[ssr] Frontend settings fetch failed, disabling add-user UI",
        error
      );
      return null;
    }),
    queryClient
      .prefetchInfiniteQuery({
        queryKey: queryKeys.users.list(search, ordering),
        queryFn: ({ pageParam }) => getUsers(pageParam, search, ordering),
        initialPageParam: null as string | null,
      })
      .catch((error) => {
        console.error(
          "[ssr] Users prefetch failed, falling back to client",
          error
        );
      }),
  ]);
  const allowAddUser = frontendSettings?.allow_add_user === true;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersPageContent allowAddUser={allowAddUser} />
    </HydrationBoundary>
  );
}
