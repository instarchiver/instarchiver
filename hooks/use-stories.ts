import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getSimilarStories, getStories, getStory } from "@/lib/api/stories";
import { queryKeys } from "@/lib/query-keys";

export function useInfiniteStories(userUuid?: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.stories.list(userUuid),
    queryFn: ({ pageParam }) => getStories(pageParam, userUuid),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.next,
  });
}

export function useStory(storyId: string) {
  return useQuery({
    queryKey: queryKeys.stories.detail(storyId),
    queryFn: () => getStory(storyId),
  });
}

export function useSimilarStories(storyId: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.stories.similar(storyId),
    queryFn: ({ pageParam }) => getSimilarStories(storyId, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.next,
  });
}
