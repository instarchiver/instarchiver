import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/api/client";
import type { Paginated } from "@/lib/api/types";
import { getUsers } from "@/lib/api/users";
import { getPosts } from "@/lib/api/posts";
import { getStories } from "@/lib/api/stories";

export const revalidate = 86400;

// ponytail: walks the cursor API, capped at MAX_PAGES * 100 URLs per type.
// Switch to generateSitemaps with a sitemap index once the archive outgrows it.
const MAX_PAGES = 50;

async function collect<T>(
  fetchPage: (cursor: string | null) => Promise<Paginated<T>>
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
  } catch {
    // Keep what we have so a backend hiccup (or no backend at build time)
    // doesn't fail the whole sitemap.
  }
  return items;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [users, posts, stories] = await Promise.all([
    collect((cursor) => getUsers(cursor, undefined, undefined, 100)),
    collect((cursor) => getPosts(cursor, undefined, undefined, 100)),
    collect((cursor) => getStories(cursor, undefined, undefined, 100)),
  ]);

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    ...["users", "posts", "stories"].map((path) => ({
      url: `${SITE_URL}/${path}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...users.map((user) => ({
      url: `${SITE_URL}/users/${user.uuid}`,
      lastModified: user.updated_at,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/posts/${post.id}`,
      lastModified: post.updated_at,
    })),
    ...stories.map((story) => ({
      url: `${SITE_URL}/stories/${story.story_id}`,
      lastModified: story.created_at,
    })),
  ];
}
