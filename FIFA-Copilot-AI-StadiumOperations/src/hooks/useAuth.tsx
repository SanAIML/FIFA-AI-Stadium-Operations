import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  getAuthSession,
  getRememberedEmail,
  isAuthenticated,
  login as authLogin,
  logout as authLogout,
} from '@/utils/auth';

interface AuthContextValue {
  authenticated: boolean;
  email: string | null;
  login: (email: string, password: string, remember?: boolean) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(isAuthenticated);
  const [email, setEmail] = useState<string | null>(() => {
  return getAuthSession()?.email ?? getRememberedEmail() ?? null;
});

  const login = useCallback((nextEmail: string, password: string, remember = false) => {
    const success = authLogin(nextEmail, password, remember);
    if (success) {
      setAuthenticated(true);
      setEmail(nextEmail);
    }
    return success;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setAuthenticated(false);
    setEmail(null);
  }, []);

  const value = useMemo(
    () => ({ authenticated, email, login, logout }),
    [authenticated, email, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
