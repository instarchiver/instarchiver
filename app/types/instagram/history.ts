import { InstagramUser } from './user';
import { ApiResponse } from '../api';

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
export type InstagramUserHistoryResponse = ApiResponse<InstagramUserHistory>;
