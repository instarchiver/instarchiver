import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getUser, getUsers } from "@/lib/api/users";
import { queryKeys } from "@/lib/query-keys";

export function useInfiniteUsers(search?: string, ordering?: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.users.list(search, ordering),
    queryFn: ({ pageParam }) => getUsers(pageParam, search, ordering),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.next,
  });
}

export function useUser(uuid: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(uuid),
    queryFn: () => getUser(uuid),
  });
}
