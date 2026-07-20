// Forzar renderizado dinámico SSR en cada request
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { getEventos, Evento } from './lib/api';
import EventoManager from './components/EventoManager';
import EventoListSkeleton from './components/EventoListSkeleton';
import AppShell from './components/AppShell';

/** Simula delay de red de 3 segundos para demostrar Skeleton SSR */
async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * EventosLoader: Server Component que obtiene eventos vía SSR.
 * Se ejecuta en el servidor, garantizando carga eficiente y SEO.
 */
async function EventosLoader() {
  let eventos: Evento[] = [];
  try {
    await delay(3000); // Espera simulada de 3 segundos (requerimiento semana 6/9)
    eventos = await getEventos();
  } catch (error) {
    console.error('Backend no disponible, iniciando con lista vacía:', error);
  }
  return <EventoManager initialEventos={eventos} />;
}

/**
 * Skeleton de página completo que se muestra durante la carga SSR (3 seg).
 */
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm h-14 animate-pulse"></div>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        <EventoListSkeleton />
      </div>
    </div>
  );
}

/**
 * Page: punto de entrada principal.
 * AppShell protege el contenido: muestra login si no hay sesión.
 * Suspense muestra Skeleton durante los 3 segundos de carga SSR.
 */
export default function Page() {
  return (
    <AppShell>
      <Suspense fallback={<PageSkeleton />}>
        <EventosLoader />
      </Suspense>
    </AppShell>
  );
}
