import axiosInstance, { setTokens, clearTokens } from '../axios';

interface LoginWithGoogleRequest {
  token: string;
}

interface LoginWithGoogleResponse {
  refresh: string;
  access: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  photo_url: string;
}

/**
 * Exchange Firebase ID token for JWT tokens
 */
export const loginWithGoogle = async (firebaseToken: string): Promise<LoginWithGoogleResponse> => {
  const response = await axiosInstance.post<LoginWithGoogleResponse>(
    '/authentication/login-with-google/',
    {
      token: firebaseToken,
    }
  );

  const { access, refresh } = response.data;

  // Store tokens in localStorage
  setTokens(access, refresh);

  return response.data;
};

/**
 * Validate the current access token
 * @returns true if token is valid, false otherwise
 */
export const validateToken = async (): Promise<boolean> => {
  try {
    const response = await axiosInstance.post('/authentication/validate/');
    return response.status === 200;
  } catch (error: unknown) {
    console.error('Token validation failed:', error);

    // Only clear tokens for specific error conditions
    // 1. DRF token_not_valid error response
    // 2. 403 Forbidden status
    let shouldClearTokens = false;

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      const status = axiosError.response?.status;
      const data = axiosError.response?.data;

      // Check for 403 status
      if (status === 403) {
        shouldClearTokens = true;
      }

      // Check for DRF token_not_valid error
      if (data && typeof data === 'object' && 'code' in data && data.code === 'token_not_valid') {
        shouldClearTokens = true;
      }
    }

    if (shouldClearTokens) {
      console.log('Clearing invalid tokens');
      clearTokens();
    } else {
      console.log('Network error or temporary issue - keeping tokens');
    }

    return false;
  }
};

/**
 * Get current user data
 */
export const getMe = async (): Promise<User | null> => {
  try {
    const response = await axiosInstance.get<User>('/authentication/me/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return null;
  }
};

export const authApi = {
  loginWithGoogle,
  validateToken,
  getMe,
};
