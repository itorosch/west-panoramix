import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'West Panoramix — Gestión de Eventos',
  description: 'Sistema de registro y gestión de eventos para West Panoramix',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
