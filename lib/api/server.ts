import { cache } from "react";
import { notFound } from "next/navigation";
import { ApiError } from "./client";
import { getUser } from "./users";
import { getPost } from "./posts";
import { getStory } from "./stories";

// A missing record becomes a real 404. Any other failure returns null so the
// page falls back to fetching in the browser instead of answering 500.
async function orNotFound<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    console.error(
      "[ssr] API fetch failed, falling back to client render",
      error,
    );
    return null;
  }
}

// cache() shares one fetch between generateMetadata and the page.
export const loadUser = cache((uuid: string) => orNotFound(getUser(uuid)));
export const loadPost = cache((id: string) => orNotFound(getPost(id)));
export const loadStory = cache((storyId: string) =>
  orNotFound(getStory(storyId)),
);
