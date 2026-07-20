/**
 * Skeleton loader para el listado de eventos.
 * Se muestra durante los 3 segundos de espera SSR (Suspense fallback).
 */
export default function EventoListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-5 rounded-lg shadow-md border animate-pulse">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/5"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded-full w-24"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-16 bg-gray-200 rounded"></div>
              <div className="h-9 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
