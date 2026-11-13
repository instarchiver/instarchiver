import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getPost, getPosts, getSimilarPosts } from "@/lib/api/posts";
import { queryKeys } from "@/lib/query-keys";

const INFINITE_LIST_STALE_TIME = 5 * 60_000;
const INFINITE_LIST_GC_TIME = 15 * 60_000;
const RECENT_HOME_LIMIT = 20;

export function useInfinitePosts(userUuid?: string, search?: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.list(userUuid, search),
    queryFn: ({ pageParam }) => getPosts(pageParam, userUuid, search),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.next,
    staleTime: INFINITE_LIST_STALE_TIME,
    gcTime: INFINITE_LIST_GC_TIME,
    refetchOnWindowFocus: false,
  });
}

export function useRecentPosts() {
  return useQuery({
    queryKey: queryKeys.posts.recent(),
    queryFn: () => getPosts(undefined, undefined, undefined, RECENT_HOME_LIMIT),
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => getPost(id),
  });
}

export function useSimilarPosts(postId: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.similar(postId),
    queryFn: ({ pageParam }) => getSimilarPosts(postId, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.next,
    staleTime: INFINITE_LIST_STALE_TIME,
    gcTime: INFINITE_LIST_GC_TIME,
    refetchOnWindowFocus: false,
  });
}
