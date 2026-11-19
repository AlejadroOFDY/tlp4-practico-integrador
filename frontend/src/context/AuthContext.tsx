import { createContext, useContext, useState, type ReactNode } from 'react';
import type { SessionUser } from '../types';

interface AuthContextValue {
  user: SessionUser | null;
  token: string | null;
  login: (token: string, user: SessionUser) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): SessionUser | null {
  const stored = localStorage.getItem('user');
  if (!stored) {
    return null;
  }
  try {
    return JSON.parse(stored) as SessionUser;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<SessionUser | null>(readStoredUser);

  const login = (newToken: string, newUser: SessionUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const hasPermission = (permission: string): boolean =>
    user?.permissions.includes(permission) ?? false;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

// El hook se exporta junto al provider para mantener el contexto en un solo archivo.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
