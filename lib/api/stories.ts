import { buildApiUrl, fetchJson } from "./client";
import type { Paginated, Story } from "./types";

export function getStories(
  cursorUrl?: string | null,
  userUuid?: string,
  search?: string
) {
  const url =
    cursorUrl ??
    buildApiUrl("/instagram/stories/", {
      page_size: "24",
      user: userUuid,
      search: search || undefined,
    });
  return fetchJson<Paginated<Story>>(url);
}

export function getStory(storyId: string) {
  return fetchJson<Story>(buildApiUrl(`/instagram/stories/${storyId}/`));
}

export function getSimilarStories(storyId: string, cursorUrl?: string | null) {
  const url =
    cursorUrl ??
    buildApiUrl(`/instagram/stories/${storyId}/similar/`, { page_size: "24" });
  return fetchJson<Paginated<Story>>(url);
}
