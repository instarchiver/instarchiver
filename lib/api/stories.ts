import api from "@/lib/axios";

export interface StoryUser {
  uuid: string;
  username: string;
  full_name: string;
  profile_picture: string;
  is_verified: boolean;
  follower_count: number;
  instagram_id: string;
  has_stories: boolean;
  has_history: boolean;
}

export interface Story {
  story_id: string;
  user: StoryUser;
  thumbnail: string;
  blur_data_url: string;
  media: string;
  is_flagged: boolean;
  created_at: string;
  story_created_at: string;
}

export interface StoriesResponse {
  next: string | null;
  previous: string | null;
  results: Story[];
}

export function extractCursor(nextUrl: string | null): string | undefined {
  if (!nextUrl) return undefined;
  const url = new URL(nextUrl);
  return url.searchParams.get("cursor") ?? undefined;
}

export async function fetchStories(cursor?: string, search?: string): Promise<StoriesResponse> {
  const params: Record<string, string> = { format: "json", page_size: "12" };
  if (cursor) params.cursor = cursor;
  if (search) params.search = search;
  const { data } = await api.get<StoriesResponse>("/instagram/stories/", { params });
  return data;
}
