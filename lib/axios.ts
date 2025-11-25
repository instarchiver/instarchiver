'use client';

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Get the base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_INSTAGRAM_API_BASE_URL || '';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Token management
const TOKEN_STORAGE_KEY = 'access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';

/**
 * Get access token from localStorage
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
};

/**
 * Set access token in localStorage
 */
export const setAccessToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

/**
 * Set refresh token in localStorage
 */
export const setRefreshToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
};

/**
 * Clear all tokens from localStorage
 */
export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
};

/**
 * Set both access and refresh tokens
 */
export const setTokens = (accessToken: string, refreshToken: string): void => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * Process queued requests after token refresh
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Refresh the access token using the refresh token
 */
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/authentication/refresh/`, {
      refresh: refreshToken,
    });

    const { access, refresh } = response.data;

    // Update tokens
    if (access) {
      setAccessToken(access);
    }
    if (refresh) {
      setRefreshToken(refresh);
    }

    return access;
  } catch (error) {
    // Clear tokens if refresh fails
    clearTokens();
    throw error;
  }
};

// Request interceptor - Add access token to requests
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh on 401 or 403 token_not_valid errors
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Check if error is 403 with token_not_valid code
    const is403TokenInvalid =
      error.response?.status === 403 &&
      error.response?.data &&
      typeof error.response.data === 'object' &&
      'code' in error.response.data &&
      error.response.data.code === 'token_not_valid';

    // If error is 401 or 403 token_not_valid and we haven't retried yet
    if ((error.response?.status === 401 || is403TokenInvalid) && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);

        // Retry the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        // Redirect to login or handle authentication failure
        // You can dispatch a logout action or redirect here
        if (typeof window !== 'undefined') {
          // Optional: Redirect to login page
          // window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
