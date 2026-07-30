import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getUser, getUsers } from "@/lib/api/users";
import { queryKeys } from "@/lib/query-keys";

export function useInfiniteUsers(search?: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.users.list(search),
    queryFn: ({ pageParam }) => getUsers(pageParam, search),
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
