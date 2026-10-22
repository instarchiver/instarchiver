import { buildApiUrl, fetchJson } from "./client";
import type { Paginated, Post } from "./types";

export function getPosts(
  cursorUrl?: string | null,
  userUuid?: string,
  search?: string,
  pageSize = 24
) {
  const url =
    cursorUrl ??
    buildApiUrl("/instagram/posts/", {
      page_size: String(pageSize),
      user: userUuid,
      search: search || undefined,
    });
  return fetchJson<Paginated<Post>>(url);
}

export function getPost(id: string) {
  return fetchJson<Post>(buildApiUrl(`/instagram/posts/${id}/`));
}

export function getSimilarPosts(postId: string, cursorUrl?: string | null) {
  const url =
    cursorUrl ??
    buildApiUrl(`/instagram/posts/${postId}/similar/`, { page_size: "24" });
  return fetchJson<Paginated<Post>>(url);
}
