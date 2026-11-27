import { buildApiUrl, fetchJson } from "./client";
import type { FrontendSettings } from "./types";

export function getFrontendSettings() {
  return fetchJson<FrontendSettings>(buildApiUrl("/settings/frontend/"), {
    auth: false,
    cache: "no-store",
  });
}
