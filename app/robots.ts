import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/api/client";
import { SITEMAP_IDS } from "./sitemap";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: SITEMAP_IDS.map((id) => `${SITE_URL}/sitemap/${id}.xml`),
  };
}
