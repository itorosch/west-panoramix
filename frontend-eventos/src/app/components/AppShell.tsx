'use client';

import { useAuth } from '../context/AuthContext';
import LoginForm from './LoginForm';

/**
 * AppShell: decide si mostrar el login o el contenido de la app.
 * Simula la protección de rutas que haría Azure AD B2C.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) return <LoginForm />;
  return <>{children}</>;
}
