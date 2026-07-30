import { buildApiUrl, fetchJson } from "./client";
import type { Paginated, Post } from "./types";

export function getPosts(cursorUrl?: string | null, userUuid?: string) {
  const url =
    cursorUrl ??
    buildApiUrl("/instagram/posts/", { page_size: "24", user: userUuid });
  return fetchJson<Paginated<Post>>(url);
}

export function getPost(id: string) {
  return fetchJson<Post>(buildApiUrl(`/instagram/posts/${id}/`));
}
