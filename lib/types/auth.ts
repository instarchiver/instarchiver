/**
 * Authentication token response from the API
 */
export interface AuthTokenResponse {
  access: string;
  refresh: string;
}

/**
 * Token refresh request payload
 */
export interface TokenRefreshRequest {
  refresh: string;
}

/**
 * Token refresh response from the API
 */
export interface TokenRefreshResponse {
  access: string;
  refresh?: string; // Some APIs return a new refresh token, some don't
}

/**
 * API error response structure
 */
export interface APIErrorResponse {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}
