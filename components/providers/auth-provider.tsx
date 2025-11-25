'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, User } from '@/lib/api/auth.api';
import { getAccessToken } from '@/lib/axios';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const checkAuth = async () => {
    setIsLoading(true);

    try {
      // Check if we have a token first
      const token = getAccessToken();

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Validate the token with the backend
      const isValid = await authApi.validateToken();
      setIsAuthenticated(isValid);

      // Fetch user data if authenticated
      if (isValid) {
        const userData = await authApi.getMe();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Validate token when the component mounts (site opens)
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
