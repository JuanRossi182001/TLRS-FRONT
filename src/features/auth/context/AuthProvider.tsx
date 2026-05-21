import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
  subscribeToAccessToken,
} from '../../../shared/api/authTokenStore';
import { loginRequest, logoutRequest, refreshRequest } from '../api/auth.api';
import type { AuthContextValue } from '../types/auth.types';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessTokenState] = useState<string | null>(() => getAccessToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return subscribeToAccessToken(setAccessTokenState);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function refreshInitialSession() {
      try {
        const response = await refreshRequest();

        if (isMounted) {
          setAccessToken(response.access_token);
        }
      } catch {
        clearAccessToken();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    refreshInitialSession();

    return () => {
      isMounted = false;
    };
  }, []);

  async function login(username: string, password: string) {
    const response = await loginRequest({ username, password });
    setAccessToken(response.access_token);
  }

  async function logout() {
    try {
      await logoutRequest();
    } finally {
      clearAccessToken();
    }
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      isLoading,
      login,
      logout,
    }),
    [accessToken, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
