import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getSimilarStories, getStories, getStory } from "@/lib/api/stories";
import { queryKeys } from "@/lib/query-keys";

const INFINITE_LIST_STALE_TIME = 5 * 60_000;
const INFINITE_LIST_GC_TIME = 15 * 60_000;
const RECENT_HOME_LIMIT = 20;

export function useInfiniteStories(userUuid?: string, search?: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.stories.list(userUuid, search),
    queryFn: ({ pageParam }) => getStories(pageParam, userUuid, search),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.next,
    staleTime: INFINITE_LIST_STALE_TIME,
    gcTime: INFINITE_LIST_GC_TIME,
    refetchOnWindowFocus: false,
  });
}

export function useRecentStories() {
  return useQuery({
    queryKey: queryKeys.stories.recent(),
    queryFn: () => getStories(undefined, undefined, undefined, RECENT_HOME_LIMIT),
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
    staleTime: INFINITE_LIST_STALE_TIME,
    gcTime: INFINITE_LIST_GC_TIME,
    refetchOnWindowFocus: false,
  });
}
