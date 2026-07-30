import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getPost, getPosts, getSimilarPosts } from "@/lib/api/posts";
import { queryKeys } from "@/lib/query-keys";

export function useInfinitePosts(userUuid?: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.list(userUuid),
    queryFn: ({ pageParam }) => getPosts(pageParam, userUuid),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.next,
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
  });
}
