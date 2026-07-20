'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { Evento, createEvento, updateEvento, deleteEvento } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { EventoFormData } from './EventoForm';
import LanguageSwitcher from './LanguageSwitcher';

// ── Skeletons para lazy loading ──────────────────────────────────────────────

const FormSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-md border animate-pulse">
    <div className="h-7 bg-gray-200 rounded w-1/3 mb-6"></div>
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i}>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  </div>
);

const ListSkeleton = () => (
  <div className="space-y-4">
    <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-white p-5 rounded-lg shadow-md border animate-pulse">
        <div className="flex justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/5"></div>
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

const AlertSkeleton = () => (
  <div className="p-4 rounded-md bg-gray-100 animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
  </div>
);

// ── Carga diferida con next/dynamic ──────────────────────────────────────────

/** EventoForm: cargado de forma diferida (sin SSR, se activa al click) */
const EventoForm = dynamic(() => import('./EventoForm'), {
  loading: () => <FormSkeleton />,
  ssr: false,
});

/** EventoList: cargado de forma diferida con SSR activado */
const EventoList = dynamic(() => import('./EventoList'), {
  loading: () => <ListSkeleton />,
  ssr: true,
});

/** AlertMessage: cargado de forma diferida */
const AlertMessage = dynamic(() => import('./AlertMessage'), {
  loading: () => <AlertSkeleton />,
  ssr: true,
});

// ── Props ─────────────────────────────────────────────────────────────────────

interface EventoManagerProps {
  initialEventos: Evento[];
}

// ── Componente principal ──────────────────────────────────────────────────────

/**
 * EventoManager: componente cliente que orquesta toda la UI de gestión de eventos.
 * Recibe los eventos precargados por SSR y maneja el estado local.
 */
export default function EventoManager({ initialEventos }: EventoManagerProps) {
  const t = useTranslations();
  const { user, logout } = useAuth();

  const [eventos, setEventos] = useState<Evento[]>(initialEventos);
  const [eventoToEdit, setEventoToEdit] = useState<Evento | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  useEffect(() => { setEventos(initialEventos); }, [initialEventos]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // ── Handlers CRUD ────────────────────────────────────────────────────────────

  const handleSubmit = async (data: EventoFormData) => {
    try {
      if (eventoToEdit) {
        // UPDATE
        const updated = await updateEvento(eventoToEdit.id, data);
        setEventos(prev => prev.map(e => e.id === eventoToEdit.id ? updated : e));
        setAlert({ message: t('events.successEdit'), type: 'success' });
      } else {
        // CREATE
        const created = await createEvento({ ...data, productora: user?.productora ?? null });
        setEventos(prev => [created, ...prev]);
        setAlert({ message: t('events.successCreate'), type: 'success' });
      }
      setShowForm(false);
      setEventoToEdit(null);
    } catch (err) {
      setAlert({ message: (err as Error).message, type: 'error' });
    }
  };

  const handleEdit = (evento: Evento) => {
    setEventoToEdit(evento);
    setShowForm(true);
    setAlert(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEvento(id);
      setEventos(prev => prev.filter(e => e.id !== id));
      setAlert({ message: t('events.successDelete'), type: 'success' });
    } catch (err) {
      setAlert({ message: (err as Error).message, type: 'error' });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEventoToEdit(null);
    setAlert(null);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / Navbar */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t('app.title')}</h1>
            <p className="text-xs text-gray-500">{t('app.subtitle')}</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <LanguageSwitcher />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {user?.username}
                <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {user?.role === 'admin' ? t('roles.admin') : t('roles.productora')}
                </span>
              </span>
              <button
                onClick={logout}
                className="text-sm text-red-500 hover:text-red-700 font-medium transition"
              >
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Alerta */}
        {alert && <AlertMessage message={alert.message} type={alert.type} />}

        {/* Botón agregar (solo admin) */}
        {user?.role === 'admin' && !showForm && (
          <button
            onClick={() => { setShowForm(true); setEventoToEdit(null); }}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-700 transition font-medium shadow-sm"
          >
            + {t('events.addButton')}
          </button>
        )}

        {/* Formulario con lazy loading */}
        {showForm && (
          <EventoForm
            eventoToEdit={eventoToEdit || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}

        {/* Listado con lazy loading */}
        <EventoList
          eventos={eventos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          filtroEstado={filtroEstado}
          onFiltroChange={setFiltroEstado}
        />
      </main>
    </div>
  );
}
