import { InstagramUser } from './user';

/**
 * Represents a history record of an Instagram user's changes
 */
export interface InstagramUserHistory extends InstagramUser {
  history_id: number;
  history_date: string;
  history_change_reason: string | null;
  history_type: string;
}

/**
 * Type for the Instagram User History API response with cursor pagination
 */
export interface InstagramUserHistoryResponse {
  next: string | null;
  previous: string | null;
  results: InstagramUserHistory[];
}
