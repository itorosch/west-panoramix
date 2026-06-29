const API_BASE = 'http://localhost:3001/api/eventos';

export interface Evento {
  id: number;
  nombreEvento: string;
  direccion: string;
  pais: string;
  ciudad: string;
  nombreProductora: string;
  fechaInicio: string;
  fechaTermino: string;
  fechaRegistro: string;
  estado: 'Pendiente' | 'Iniciado' | 'Finalizado';
}

export async function getEventos(): Promise<Evento[]> {
  const res = await fetch(API_BASE, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener eventos');
  return res.json();
}

export async function createEvento(evento: Omit<Evento, 'id' | 'fechaRegistro'>): Promise<Evento> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(evento),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al crear evento');
  }
  return res.json();
}

export async function deleteEvento(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al eliminar evento');
  }
}
