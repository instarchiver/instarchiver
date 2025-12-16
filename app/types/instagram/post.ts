/**
 * Instagram Post related types
 */

export interface PostMedia {
  id: number;
  thumbnail_url: string;
  blur_data_url: string;
  media_url: string;
  thumbnail: string | null;
  media: string | null;
  created_at: string;
  updated_at: string;
}

export interface InstagramUser {
  uuid: string;
  has_stories: boolean;
  has_history: boolean;
  instagram_id: string;
  username: string;
  full_name: string;
  profile_picture: string;
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
  api_updated_at: string;
}

export type PostVariant = 'normal' | 'video' | 'carousel';

export interface InstagramPost {
  id: string;
  variant: PostVariant;
  thumbnail_url: string;
  thumbnail: string | null;
  blur_data_url: string;
  media_count: number;
  post_created_at: string;
  created_at: string;
  updated_at: string;
  media: PostMedia[];
  user: InstagramUser;
}
