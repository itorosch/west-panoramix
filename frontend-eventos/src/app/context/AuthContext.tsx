'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'productora';

export interface AuthUser {
  username: string;
  role: UserRole;
  productora?: string; // nombre productora si role === 'productora'
}

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Usuarios simulados (reemplaza Azure AD B2C)
export const MOCK_USERS: Array<{ username: string; password: string; role: UserRole; productora?: string }> = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'gamboa', password: 'gamboa123', role: 'productora', productora: 'Gamboa Producciones' },
  { username: 'panoramix', password: 'pan123', role: 'productora', productora: 'Panoramix Events' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Persistir sesión en sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('wp_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (u: AuthUser) => {
    setUser(u);
    sessionStorage.setItem('wp_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('wp_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
