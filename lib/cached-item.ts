import type { QueryClient } from "@tanstack/react-query";

/**
 * Finds an item already sitting in any cached query under `root` (detail,
 * recent, infinite list or similar). Loading states use it to show the
 * thumbnail the visitor just tapped, so the grid tile can morph into it.
 */
export function findCachedItem<T>(
  queryClient: QueryClient,
  root: string,
  match: (item: T) => boolean
): T | undefined {
  for (const [, data] of queryClient.getQueriesData<unknown>({ queryKey: [root] })) {
    if (!data || typeof data !== "object") continue;
    const items: unknown[] =
      "pages" in data
        ? (data.pages as { results: T[] }[]).flatMap((page) => page.results)
        : "results" in data
          ? (data.results as T[])
          : [data];
    const found = (items as T[]).find(match);
    if (found) return found;
  }
  return undefined;
}
