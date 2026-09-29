import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createUser, getUser, getUserHistory, getUsers } from "@/lib/api/users";
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

export function useInfiniteUserHistory(uuid: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.users.history(uuid),
    queryFn: ({ pageParam }) => getUserHistory(uuid, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.next,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.users.detail(user.uuid), user);
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.users.lists }),
        queryClient.invalidateQueries({ queryKey: queryKeys.stats }),
      ]);
    },
  });
}
