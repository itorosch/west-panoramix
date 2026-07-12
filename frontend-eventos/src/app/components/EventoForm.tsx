'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Evento } from '../lib/api';

// Datos de países y ciudades
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
const ESTADOS = ['Pendiente', 'Iniciado', 'Finalizado'] as const;

interface EventoFormProps {
  onSubmit: (evento: Omit<Evento, 'id' | 'fechaRegistro'>) => Promise<void>;
  onCancel: () => void;
}

type FormValues = {
  nombreEvento: string;
  direccion: string;
  pais: string;
  ciudad: string;
  nombreProductora: string;
  fechaInicio: string;
  fechaTermino: string;
  estado: 'Pendiente' | 'Iniciado' | 'Finalizado';
};

export default function EventoForm({ onSubmit, onCancel }: EventoFormProps) {
  const { t, i18n } = useTranslation('evento');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
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

  const paisSeleccionado = watch('pais');
  const fechaInicio = watch('fechaInicio');
  const ciudadesDisponibles = paisSeleccionado ? PAISES_CIUDADES[paisSeleccionado] || [] : [];

  // Referencia siempre actualizada a los errores actuales, para poder leerlos
  // sin agregar "errors" como dependencia del efecto (evitaría loops de render).
  const errorsRef = useRef(errors);
  errorsRef.current = errors;

  // Si el usuario cambia el idioma mientras hay errores visibles en pantalla,
  // se revalidan solo esos campos para que el mensaje se muestre traducido.
  useEffect(() => {
    const camposConError = Object.keys(errorsRef.current) as (keyof FormValues)[];
    if (camposConError.length > 0) {
      trigger(camposConError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const onSubmitForm = async (data: FormValues) => {
    await onSubmit(data);
  };

  const inputClass = (hasError: boolean) =>
    `mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 ${
      hasError ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('form.title')}</h2>
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4" noValidate>
        {/* Nombre del evento */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('label.nombreEvento')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={t('placeholder.nombreEvento')}
            {...register('nombreEvento', { required: t('validation.required') })}
            className={inputClass(!!errors.nombreEvento)}
          />
          {errors.nombreEvento && <p className="text-red-600 text-xs mt-1">{errors.nombreEvento.message}</p>}
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('label.direccion')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={t('placeholder.direccion')}
            {...register('direccion', { required: t('validation.required') })}
            className={inputClass(!!errors.direccion)}
          />
          {errors.direccion && <p className="text-red-600 text-xs mt-1">{errors.direccion.message}</p>}
        </div>

        {/* País y Ciudad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('label.pais')} <span className="text-red-500">*</span>
            </label>
            <select
              {...register('pais', {
                required: t('validation.paisRequired'),
                onChange: () => setValue('ciudad', ''),
              })}
              className={inputClass(!!errors.pais)}
            >
              <option value="">{t('placeholder.selectPais')}</option>
              {PAISES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.pais && <p className="text-red-600 text-xs mt-1">{errors.pais.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('label.ciudad')} <span className="text-red-500">*</span>
            </label>
            <select
              {...register('ciudad', { required: t('validation.ciudadRequired') })}
              disabled={!paisSeleccionado}
              className={`${inputClass(!!errors.ciudad)} disabled:bg-gray-100 disabled:cursor-not-allowed`}
            >
              <option value="">{t('placeholder.selectCiudad')}</option>
              {ciudadesDisponibles.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.ciudad && <p className="text-red-600 text-xs mt-1">{errors.ciudad.message}</p>}
          </div>
        </div>

        {/* Nombre Productora */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('label.nombreProductora')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={t('placeholder.nombreProductora')}
            {...register('nombreProductora', { required: t('validation.required') })}
            className={inputClass(!!errors.nombreProductora)}
          />
          {errors.nombreProductora && <p className="text-red-600 text-xs mt-1">{errors.nombreProductora.message}</p>}
        </div>

        {/* Fechas: el formato mostrado (dd/mm/aaaa vs mm/dd/aaaa, 24h vs AM/PM)
            lo entrega el propio navegador según el idioma/región del sistema
            operativo del usuario, ya que se usa <input type="datetime-local">. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('label.fechaInicio')} <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              {...register('fechaInicio', { required: t('validation.required') })}
              className={inputClass(!!errors.fechaInicio)}
            />
            {errors.fechaInicio && <p className="text-red-600 text-xs mt-1">{errors.fechaInicio.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('label.fechaTermino')} <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              {...register('fechaTermino', {
                required: t('validation.required'),
                validate: (value) =>
                  !fechaInicio || new Date(value) > new Date(fechaInicio) || t('validation.fechaTerminoInvalida'),
              })}
              className={inputClass(!!errors.fechaTermino)}
            />
            {errors.fechaTermino && <p className="text-red-600 text-xs mt-1">{errors.fechaTermino.message}</p>}
          </div>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('label.estado')} <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            {ESTADOS.map((estado) => (
              <label key={estado} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={estado}
                  {...register('estado', { required: true })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{t(`estado.${estado}`)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 font-medium"
          >
            {isSubmitting ? t('button.saving', { ns: 'common' }) : t('button.save', { ns: 'common' })}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition font-medium"
          >
            {t('button.cancel', { ns: 'common' })}
          </button>
        </div>
      </form>
    </div>
  );
}
