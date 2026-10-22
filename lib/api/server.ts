import { cache } from "react";
import { notFound } from "next/navigation";
import { ApiError } from "./client";
import { getUser } from "./users";
import { getPost } from "./posts";
import { getStory } from "./stories";

// A missing record becomes a real 404 instead of a 200 error page.
async function orNotFound<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

// cache() shares one fetch between generateMetadata and the page.
export const loadUser = cache((uuid: string) => orNotFound(getUser(uuid)));
export const loadPost = cache((id: string) => orNotFound(getPost(id)));
export const loadStory = cache((storyId: string) =>
  orNotFound(getStory(storyId))
);
