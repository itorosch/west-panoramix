'use client';

interface AlertMessageProps {
  message: string;
  type: 'success' | 'error';
}

/**
 * Componente de alerta reutilizable para feedback al usuario.
 * Muestra un mensaje con estilo según el tipo (success/error).
 */
export default function AlertMessage({ message, type }: AlertMessageProps) {
  return (
    <div
      role="alert"
      className={`p-4 rounded-md text-sm font-medium ${
        type === 'success'
          ? 'bg-green-100 text-green-800 border border-green-300'
          : 'bg-red-100 text-red-800 border border-red-300'
      }`}
    >
      {message}
    </div>
  );
}
