import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { AuthProvider } from './context/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'West Panoramix — Gestión de Eventos',
  description: 'Sistema de registro y gestión de eventos para West Panoramix',
};

/**
 * RootLayout: configura providers de i18n (next-intl) y autenticación (AuthProvider).
 * Los mensajes se pasan al cliente desde el servidor (SSR).
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
