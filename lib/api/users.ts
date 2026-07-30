import { buildApiUrl, fetchJson } from "./client";
import type { InstagramUser, Paginated } from "./types";

export function getUsers(cursorUrl?: string | null, search?: string) {
  const url =
    cursorUrl ??
    buildApiUrl("/instagram/users/", {
      page_size: "24",
      search: search || undefined,
    });
  return fetchJson<Paginated<InstagramUser>>(url);
}

export function getUser(uuid: string) {
  return fetchJson<InstagramUser>(buildApiUrl(`/instagram/users/${uuid}/`));
}
