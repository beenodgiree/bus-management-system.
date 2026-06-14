import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authApi } from '../api/services';
import { tokenStore } from '../api/client';
import type { AuthUser, Role } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Decode the payload of a JWT without a library (no signature check — the
// backend remains the source of truth; this only restores the UI session).
function decodeToken(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.sub) return null;
    return {
      username: payload.sub as string,
      fullName: (payload.fullName as string) ?? payload.sub,
      role: (payload.role as Role) ?? 'STAFF',
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = tokenStore.get();
    return token ? decodeToken(token) : null;
  });

  // Keep state aligned with a token cleared by the axios 401 interceptor.
  useEffect(() => {
    if (!tokenStore.get()) setUser(null);
  }, []);

  const login = async (username: string, password: string) => {
    const res = await authApi.login(username, password);
    tokenStore.set(res.token);
    setUser({ username: res.username, fullName: res.fullName, role: res.role });
  };

  const logout = () => {
    tokenStore.clear();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, login, logout }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
