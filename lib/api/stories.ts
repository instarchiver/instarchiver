import { buildApiUrl, fetchJson } from "./client";
import type { Paginated, Story } from "./types";

export function getStories(cursorUrl?: string | null, userUuid?: string) {
  const url =
    cursorUrl ??
    buildApiUrl("/instagram/stories/", { page_size: "24", user: userUuid });
  return fetchJson<Paginated<Story>>(url);
}

export function getStory(storyId: string) {
  return fetchJson<Story>(buildApiUrl(`/instagram/stories/${storyId}/`));
}
