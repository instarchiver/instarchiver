import { InstagramUser } from './user';

/**
 * Interface representing an Instagram Story
 */
export interface InstagramStory {
  story_id: string;
  user: InstagramUser;
  thumbnail: string;
  blur_data_url: string;
  media: string;
  created_at: string;
  story_created_at: string;
}

/**
 * Interface representing the Instagram Stories API response
 */
export interface InstagramStoriesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: InstagramStory[];
}
