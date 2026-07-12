import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import LanguageSelector from './components/LanguageSelector';

export const metadata: Metadata = {
  title: 'West Panoramix — Gestión de Eventos',
  description: 'Sistema de registro y gestión de eventos para West Panoramix',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">
        <Providers>
          <div className="relative min-h-screen">
            <div className="absolute top-4 right-4 z-10">
              <LanguageSelector />
            </div>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
