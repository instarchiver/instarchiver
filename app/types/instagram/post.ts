/**
 * Instagram Post related types
 */

import type { InstagramUser } from './user';

export interface PostMedia {
  id: number;
  thumbnail_url: string;
  blur_data_url: string;
  media_url: string;
  thumbnail: string | null;
  media: string | null;
  width: number;
  height: number;
  created_at: string;
  updated_at: string;
}

export type PostVariant = 'normal' | 'video' | 'carousel';

export interface InstagramPost {
  id: string;
  variant: PostVariant;
  thumbnail_url: string;
  thumbnail: string | null;
  blur_data_url: string;
  width: number;
  height: number;
  media_count: number;
  post_created_at: string;
  created_at: string;
  updated_at: string;
  media: PostMedia[];
  user: InstagramUser;
}
