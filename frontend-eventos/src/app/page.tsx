// Forzar renderizado dinámico (SSR) en cada request
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { getEventos, Evento } from './lib/api';
import EventoManager from './components/EventoManager';
import EventoListSkeleton from './components/EventoListSkeleton';

// Simula delay de red de 3 segundos (SSR)
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Componente servidor que carga los eventos con SSR
async function EventosLoader() {
  let eventos: Evento[] = [];
  try {
    await delay(3000); // Espera simulada de 3 segundos
    eventos = await getEventos();
  } catch (error) {
    console.error('Error al obtener eventos desde el servidor:', error);
    // Si el backend no está disponible, arranca con lista vacía
  }
  return <EventoManager initialEventos={eventos} />;
}

// Skeleton que se muestra durante los 3 segundos de espera SSR
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-200 animate-pulse">
          <div className="h-9 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        {/* Button skeleton */}
        <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        {/* List skeleton */}
        <EventoListSkeleton />
      </div>
    </div>
  );
}

export default async function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <EventosLoader />
    </Suspense>
  );
}
