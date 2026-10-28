import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/api/client";
import type { Paginated } from "@/lib/api/types";
import { getUsers } from "@/lib/api/users";
import { getPosts } from "@/lib/api/posts";
import { getStories } from "@/lib/api/stories";

export const revalidate = 86400;

export const SITEMAP_IDS = ["pages", "users", "posts", "stories"] as const;
type SitemapId = (typeof SITEMAP_IDS)[number];

// ponytail: one sitemap per type. Google caps a sitemap at 50,000 URLs, and the
// cursor API can't jump to page N, so a type past 50k needs a backend endpoint
// with page-number pagination before it can be chunked.
const MAX_PAGES = 500;

export function generateSitemaps() {
  return SITEMAP_IDS.map((id) => ({ id }));
}

async function collect<T>(
  fetchPage: (cursor: string | null) => Promise<Paginated<T>>,
): Promise<T[]> {
  const items: T[] = [];
  let cursor: string | null = null;
  try {
    for (let page = 0; page < MAX_PAGES; page++) {
      const data = await fetchPage(cursor);
      items.push(...data.results);
      if (!data.next) break;
      cursor = data.next;
    }
  } catch (error) {
    // Keep what we have so a backend hiccup (or no backend at build time)
    // doesn't fail the whole sitemap.
    console.error(`[sitemap] stopped after ${items.length} items`, error);
  }
  return items;
}

const builders: Record<SitemapId, () => Promise<MetadataRoute.Sitemap>> = {
  pages: async () => [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    ...["users", "posts", "stories"].map((path) => ({
      url: `${SITE_URL}/${path}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ],
  users: async () =>
    (await collect((c) => getUsers(c, undefined, undefined, 100))).map(
      (user) => ({
        url: `${SITE_URL}/users/${user.uuid}`,
        lastModified: user.updated_at,
      }),
    ),
  posts: async () =>
    (await collect((c) => getPosts(c, undefined, undefined, 100))).map(
      (post) => ({
        url: `${SITE_URL}/posts/${post.id}`,
        lastModified: post.updated_at,
      }),
    ),
  stories: async () =>
    (await collect((c) => getStories(c, undefined, undefined, 100))).map(
      (story) => ({
        url: `${SITE_URL}/stories/${story.story_id}`,
        lastModified: story.created_at,
      }),
    ),
};

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = (await props.id) as SitemapId;
  return builders[id]?.() ?? [];
}
