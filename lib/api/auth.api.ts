import axiosInstance, { setTokens } from '../axios';

interface LoginWithGoogleRequest {
  token: string;
}

interface LoginWithGoogleResponse {
  refresh: string;
  access: string;
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

export const authApi = {
  loginWithGoogle,
};
