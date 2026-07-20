'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { Evento } from '../lib/api';

// Datos de países y ciudades disponibles
const PAISES_CIUDADES: Record<string, string[]> = {
  Argentina: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'Tucumán'],
  Bolivia: ['La Paz', 'Cochabamba', 'Santa Cruz', 'Sucre', 'Oruro'],
  Brasil: ['São Paulo', 'Río de Janeiro', 'Brasília', 'Salvador', 'Fortaleza'],
  Chile: ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Temuco', 'Antofagasta', 'Rancagua'],
  Colombia: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'],
  Ecuador: ['Quito', 'Guayaquil', 'Cuenca', 'Ambato', 'Santo Domingo'],
  España: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao'],
  México: ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana'],
  Paraguay: ['Asunción', 'Ciudad del Este', 'San Lorenzo', 'Lambaré', 'Fernando de la Mora'],
  Perú: ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Cusco'],
  Uruguay: ['Montevideo', 'Salto', 'Paysandú', 'Las Piedras', 'Rivera'],
  Venezuela: ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay'],
};

const PAISES = Object.keys(PAISES_CIUDADES).sort();

export type EventoFormData = {
  nombreEvento: string;
  direccion: string;
  pais: string;
  ciudad: string;
  nombreProductora: string;
  fechaInicio: string;
  fechaTermino: string;
  estado: 'Pendiente' | 'Iniciado' | 'Finalizado';
};

interface EventoFormProps {
  eventoToEdit?: Evento;
  onSubmit: (data: EventoFormData) => Promise<void>;
  onCancel: () => void;
}

/**
 * Formulario de eventos con React Hook Form y validaciones i18n.
 * Soporta modo creación y modo edición.
 * El ID y la fecha de registro son de solo lectura.
 */
export default function EventoForm({ eventoToEdit, onSubmit, onCancel }: EventoFormProps) {
  const t = useTranslations();
  const isEdit = !!eventoToEdit;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventoFormData>({
    defaultValues: {
      nombreEvento: '',
      direccion: '',
      pais: '',
      ciudad: '',
      nombreProductora: '',
      fechaInicio: '',
      fechaTermino: '',
      estado: 'Pendiente',
    },
  });

  const selectedPais = watch('pais');
  const ciudades = selectedPais ? PAISES_CIUDADES[selectedPais] || [] : [];

  // Cargar datos del evento al editar
  useEffect(() => {
    if (eventoToEdit) {
      reset({
        nombreEvento: eventoToEdit.nombreEvento,
        direccion: eventoToEdit.direccion,
        pais: eventoToEdit.pais,
        ciudad: eventoToEdit.ciudad,
        nombreProductora: eventoToEdit.nombreProductora,
        fechaInicio: eventoToEdit.fechaInicio,
        fechaTermino: eventoToEdit.fechaTermino,
        estado: eventoToEdit.estado,
      });
    }
  }, [eventoToEdit, reset]);

  const inputClass = (hasError: boolean) =>
    `mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 ${
      hasError ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? t('events.editTitle') : t('events.createTitle')}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

        {/* ID (solo lectura en edición) */}
        {isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('form.id')}</label>
            <input
              type="text"
              value={`#${eventoToEdit!.id}`}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
        )}

        {/* Nombre del evento */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('form.name')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={t('form.namePlaceholder')}
            {...register('nombreEvento', { required: t('form.required') })}
            className={inputClass(!!errors.nombreEvento)}
          />
          {errors.nombreEvento && <p className="text-red-500 text-xs mt-1">{errors.nombreEvento.message}</p>}
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('form.address')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={t('form.addressPlaceholder')}
            {...register('direccion', { required: t('form.required') })}
            className={inputClass(!!errors.direccion)}
          />
          {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion.message}</p>}
        </div>

        {/* País y Ciudad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('form.country')} <span className="text-red-500">*</span>
            </label>
            <select
              {...register('pais', { required: t('form.required') })}
              className={inputClass(!!errors.pais)}
            >
              <option value="">{t('form.countryPlaceholder')}</option>
              {PAISES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.pais && <p className="text-red-500 text-xs mt-1">{errors.pais.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('form.city')} <span className="text-red-500">*</span>
            </label>
            <select
              {...register('ciudad', { required: t('form.required') })}
              disabled={!selectedPais}
              className={`${inputClass(!!errors.ciudad)} disabled:bg-gray-100 disabled:cursor-not-allowed`}
            >
              <option value="">{t('form.cityPlaceholder')}</option>
              {ciudades.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.ciudad && <p className="text-red-500 text-xs mt-1">{errors.ciudad.message}</p>}
          </div>
        </div>

        {/* Nombre Productora */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('form.productoraName')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={t('form.productoraPlaceholder')}
            {...register('nombreProductora', { required: t('form.required') })}
            className={inputClass(!!errors.nombreProductora)}
          />
          {errors.nombreProductora && <p className="text-red-500 text-xs mt-1">{errors.nombreProductora.message}</p>}
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('form.startDate')} <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              {...register('fechaInicio', { required: t('form.required') })}
              className={inputClass(!!errors.fechaInicio)}
            />
            {errors.fechaInicio && <p className="text-red-500 text-xs mt-1">{errors.fechaInicio.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('form.endDate')} <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              {...register('fechaTermino', {
                required: t('form.required'),
                validate: (val) => {
                  const inicio = watch('fechaInicio');
                  if (inicio && val && new Date(val) <= new Date(inicio)) {
                    return t('form.dateEndError');
                  }
                  return true;
                },
              })}
              className={inputClass(!!errors.fechaTermino)}
            />
            {errors.fechaTermino && <p className="text-red-500 text-xs mt-1">{errors.fechaTermino.message}</p>}
          </div>
        </div>

        {/* Fecha de registro (solo lectura en edición) */}
        {isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('form.registerDate')}</label>
            <input
              type="text"
              value={new Date(eventoToEdit!.fechaRegistro).toLocaleString('es-CL')}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
        )}

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('form.status')} <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-6">
            {[
              { value: 'Pendiente', label: t('form.statusPending') },
              { value: 'Iniciado', label: t('form.statusStarted') },
              { value: 'Finalizado', label: t('form.statusFinished') },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={value}
                  {...register('estado', { required: t('form.required') })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
          {errors.estado && <p className="text-red-500 text-xs mt-1">{errors.estado.message}</p>}
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 font-medium"
          >
            {isSubmitting ? '...' : isEdit ? t('events.saveButton') : t('events.createButton')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition font-medium"
          >
            {t('events.cancelButton')}
          </button>
        </div>
      </form>
    </div>
  );
}
