'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Evento, createEvento, deleteEvento } from '../lib/api';

// Skeletons inline para feedback visual durante lazy loading
const FormSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-md border animate-pulse">
    <div className="h-7 bg-gray-200 rounded w-1/3 mb-6"></div>
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i}>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        <div className="h-10 bg-gray-200 rounded w-32"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </div>
);

const ListSkeleton = () => (
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
          <div className="h-9 w-24 bg-gray-200 rounded ml-4"></div>
        </div>
      </div>
    ))}
  </div>
);

const AlertSkeleton = () => (
  <div className="p-4 rounded-md bg-gray-100 animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
  </div>
);

// Carga diferida de componentes con next/dynamic
const EventoForm = dynamic(() => import('./EventoForm'), {
  loading: () => <FormSkeleton />,
  ssr: false,
});

const EventoList = dynamic(() => import('./EventoList'), {
  loading: () => <ListSkeleton />,
  ssr: true,
});

const AlertMessage = dynamic(() => import('./AlertMessage'), {
  loading: () => <AlertSkeleton />,
  ssr: true,
});

interface EventoManagerProps {
  initialEventos: Evento[];
}

export default function EventoManager({ initialEventos }: EventoManagerProps) {
  const [eventos, setEventos] = useState<Evento[]>(initialEventos);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  useEffect(() => {
    setEventos(initialEventos);
  }, [initialEventos]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleSubmit = async (eventoData: Omit<Evento, 'id' | 'fechaRegistro'>) => {
    try {
      const newEvento = await createEvento(eventoData);
      setEventos((prev) => [newEvento, ...prev]);
      setAlert({ message: `Evento "${newEvento.nombreEvento}" registrado exitosamente.`, type: 'success' });
      setShowForm(false);
    } catch (error) {
      setAlert({ message: (error as Error).message, type: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEvento(id);
      setEventos((prev) => prev.filter((e) => e.id !== id));
      setAlert({ message: 'Evento eliminado exitosamente.', type: 'success' });
    } catch (error) {
      setAlert({ message: (error as Error).message, type: 'error' });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setAlert(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
          <h1 className="text-3xl font-bold text-gray-900">West Panoramix</h1>
          <p className="text-gray-500 mt-1">Sistema de Gestión de Eventos</p>
        </div>

        {/* Alerta */}
        {alert && <AlertMessage message={alert.message} type={alert.type} />}

        {/* Botón agregar */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-700 transition font-medium shadow-sm"
          >
            + Registrar Evento
          </button>
        )}

        {/* Formulario con lazy loading */}
        {showForm && (
          <EventoForm onSubmit={handleSubmit} onCancel={handleCancel} />
        )}

        {/* Listado con lazy loading */}
        <EventoList
          eventos={eventos}
          onDelete={handleDelete}
          filtroEstado={filtroEstado}
          onFiltroChange={setFiltroEstado}
        />
      </div>
    </div>
  );
}
