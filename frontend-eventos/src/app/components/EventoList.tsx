'use client';

import { Evento } from '../lib/api';

interface EventoListProps {
  eventos: Evento[];
  onDelete: (id: number) => void;
  filtroEstado: string;
  onFiltroChange: (estado: string) => void;
}

const ESTADO_COLORS: Record<string, string> = {
  Pendiente: 'bg-yellow-100 text-yellow-800',
  Iniciado: 'bg-blue-100 text-blue-800',
  Finalizado: 'bg-green-100 text-green-800',
};

function formatFecha(isoString: string) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatFechaRegistro(isoString: string) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleString('es-CL');
}

export default function EventoList({ eventos, onDelete, filtroEstado, onFiltroChange }: EventoListProps) {
  const eventosFiltrados =
    filtroEstado === 'Todos'
      ? eventos
      : eventos.filter((e) => e.estado === filtroEstado);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Listado de Eventos</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Filtrar por estado:</label>
          <select
            value={filtroEstado}
            onChange={(e) => onFiltroChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todos">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Iniciado">Iniciado</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>
      </div>

      {eventosFiltrados.length === 0 ? (
        <p className="text-gray-500 italic">No hay eventos para mostrar.</p>
      ) : (
        <div className="grid gap-4">
          {eventosFiltrados.map((evento) => (
            <div key={evento.id} className="bg-white p-5 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-400 font-mono">#{evento.id}</span>
                    <h3 className="text-lg font-semibold text-gray-800">{evento.nombreEvento}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${ESTADO_COLORS[evento.estado] || 'bg-gray-100 text-gray-800'}`}>
                      {evento.estado}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Productora:</span> {evento.nombreProductora}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Dirección:</span> {evento.direccion}, {evento.ciudad}, {evento.pais}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Inicio:</span> {formatFecha(evento.fechaInicio)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Término:</span> {formatFecha(evento.fechaTermino)}
                  </p>
                  <p className="text-xs text-gray-400">
                    Registrado: {formatFechaRegistro(evento.fechaRegistro)}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(evento.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm whitespace-nowrap"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
