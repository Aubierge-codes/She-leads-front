'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, apiErrorMessage, AuthUser, TOKEN_STORAGE_KEY } from './api';

const USER_STORAGE_KEY = 'ecogirlscollective_user';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = window.localStorage.getItem(USER_STORAGE_KEY);
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { accessToken, user: loggedInUser } = await authApi.login(email, password);
      window.localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
      setUser(loggedInUser);
    } catch (error) {
      throw new Error(apiErrorMessage(error, 'Invalid email or password'));
    }
  };

  const logout = () => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    router.push('/auth/login');
  };

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

