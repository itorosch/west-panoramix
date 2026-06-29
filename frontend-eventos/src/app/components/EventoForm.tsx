'use client';

import { useState } from 'react';
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

interface EventoFormProps {
  onSubmit: (evento: Omit<Evento, 'id' | 'fechaRegistro'>) => Promise<void>;
  onCancel: () => void;
}

type FormState = {
  nombreEvento: string;
  direccion: string;
  pais: string;
  ciudad: string;
  nombreProductora: string;
  fechaInicio: string;
  fechaTermino: string;
  estado: 'Pendiente' | 'Iniciado' | 'Finalizado';
};

const INITIAL_FORM: FormState = {
  nombreEvento: '',
  direccion: '',
  pais: '',
  ciudad: '',
  nombreProductora: '',
  fechaInicio: '',
  fechaTermino: '',
  estado: 'Pendiente',
};

export default function EventoForm({ onSubmit, onCancel }: EventoFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading] = useState(false);

  const ciudadesDisponibles = form.pais ? PAISES_CIUDADES[form.pais] || [] : [];

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.nombreEvento.trim())
      newErrors.nombreEvento = 'El nombre del evento es obligatorio';

    if (!form.direccion.trim())
      newErrors.direccion = 'La dirección es obligatoria';

    if (!form.pais)
      newErrors.pais = 'Debe seleccionar un país';

    if (!form.ciudad)
      newErrors.ciudad = 'Debe seleccionar una ciudad';

    if (!form.nombreProductora.trim())
      newErrors.nombreProductora = 'El nombre de la productora es obligatorio';

    if (!form.fechaInicio)
      newErrors.fechaInicio = 'La fecha de inicio es obligatoria';

    if (!form.fechaTermino)
      newErrors.fechaTermino = 'La fecha de término es obligatoria';

    if (form.fechaInicio && form.fechaTermino && new Date(form.fechaTermino) <= new Date(form.fechaInicio))
      newErrors.fechaTermino = 'La fecha de término debe ser posterior a la de inicio';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Si cambia el país, resetear ciudad
    if (name === 'pais') {
      setForm((prev) => ({ ...prev, pais: value, ciudad: '' }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(form);
      setForm(INITIAL_FORM);
      setErrors({});
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof FormState) =>
    `mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`;

  const errorText = (field: keyof FormState) =>
    errors[field] ? <p className="text-red-600 text-xs mt-1">{errors[field]}</p> : null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Registrar Nuevo Evento</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Nombre del evento */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre del Evento <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nombreEvento"
            value={form.nombreEvento}
            onChange={handleChange}
            onBlur={validate}
            placeholder="Ej: Festival Folclórico Internacional"
            className={inputClass('nombreEvento')}
          />
          {errorText('nombreEvento')}
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Dirección <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            onBlur={validate}
            placeholder="Ej: Los Huasos #2233"
            className={inputClass('direccion')}
          />
          {errorText('direccion')}
        </div>

        {/* País y Ciudad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              País <span className="text-red-500">*</span>
            </label>
            <select
              name="pais"
              value={form.pais}
              onChange={handleChange}
              onBlur={validate}
              className={inputClass('pais')}
            >
              <option value="">— Seleccione país —</option>
              {PAISES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errorText('pais')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ciudad <span className="text-red-500">*</span>
            </label>
            <select
              name="ciudad"
              value={form.ciudad}
              onChange={handleChange}
              onBlur={validate}
              disabled={!form.pais}
              className={`${inputClass('ciudad')} disabled:bg-gray-100 disabled:cursor-not-allowed`}
            >
              <option value="">— Seleccione ciudad —</option>
              {ciudadesDisponibles.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errorText('ciudad')}
          </div>
        </div>

        {/* Nombre Productora */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre Productora <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nombreProductora"
            value={form.nombreProductora}
            onChange={handleChange}
            onBlur={validate}
            placeholder="Ej: Gamboa Producciones"
            className={inputClass('nombreProductora')}
          />
          {errorText('nombreProductora')}
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha y Hora de Inicio <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="fechaInicio"
              value={form.fechaInicio}
              onChange={handleChange}
              onBlur={validate}
              className={inputClass('fechaInicio')}
            />
            {errorText('fechaInicio')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha y Hora de Término <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="fechaTermino"
              value={form.fechaTermino}
              onChange={handleChange}
              onBlur={validate}
              className={inputClass('fechaTermino')}
            />
            {errorText('fechaTermino')}
          </div>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado del Evento <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            {(['Pendiente', 'Iniciado', 'Finalizado'] as const).map((estado) => (
              <label key={estado} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="estado"
                  value={estado}
                  checked={form.estado === estado}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{estado}</span>
              </label>
            ))}
          </div>
          {errorText('estado')}
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 font-medium"
          >
            {loading ? 'Guardando...' : 'Registrar Evento'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition font-medium"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
