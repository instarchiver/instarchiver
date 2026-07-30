export interface Paginated<T> {
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface InstagramUser {
  uuid: string;
  instagram_id: string;
  username: string;
  full_name: string;
  profile_picture: string | null;
  biography: string;
  is_private: boolean;
  is_verified: boolean;
  media_count: number;
  follower_count: number;
  following_count: number;
  allow_auto_update_stories: boolean;
  allow_auto_update_profile: boolean;
  created_at: string;
  updated_at: string;
  api_updated_at: string | null;
  has_stories: boolean;
  has_history: boolean;
  // detail-only extras
  original_profile_picture_url?: string | null;
  auto_update_stories_limit_count?: number;
  auto_update_profile_limit_count?: number;
  updated_at_from_api?: string | null;
}

export type PostVariant = "normal" | "carousel" | "video";

export interface PostMedia {
  id: string;
  thumbnail_url: string | null;
  blur_data_url: string | null;
  media_url: string | null;
  thumbnail: string | null;
  media: string | null;
  width: number | null;
  height: number | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  variant: PostVariant;
  thumbnail_url: string | null;
  thumbnail: string | null;
  blur_data_url: string | null;
  width: number | null;
  height: number | null;
  caption: string | null;
  media_count?: number;
  is_flagged: boolean;
  post_created_at: string;
  created_at: string;
  updated_at: string;
  media: PostMedia[];
  user: InstagramUser;
}

export interface Story {
  story_id: string;
  user: InstagramUser;
  thumbnail: string | null;
  blur_data_url: string | null;
  media: string | null;
  is_flagged: boolean;
  created_at: string;
  story_created_at: string;
}

export interface SiteStatistics {
  total_users: number;
  total_stories: number;
  total_posts: number;
}
