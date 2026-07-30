import { buildApiUrl, fetchJson } from "./client";
import type { SiteStatistics } from "./types";

export async function getStatistics(): Promise<SiteStatistics | null> {
  try {
    return await fetchJson<SiteStatistics>(
      buildApiUrl("/instagram/statistic/"),
      { cache: "no-store" }
    );
  } catch {
    return null;
  }
}
