'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useAuth, MOCK_USERS, UserRole } from '../context/AuthContext';

interface LoginInputs {
  username: string;
  password: string;
  role: UserRole;
  productora?: string;
}

export default function LoginForm() {
  const t = useTranslations();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>({
    defaultValues: { role: 'admin' },
  });

  const onSubmit = (data: LoginInputs) => {
    const found = MOCK_USERS.find(
      u => u.username === data.username && u.password === data.password && u.role === data.role
    );
    if (!found) {
      setError(t('login.error'));
      return;
    }
    setError('');
    login({ username: found.username, role: found.role, productora: found.productora });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <span className="text-white text-2xl font-bold">WP</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t('app.title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('login.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('login.role')}</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="admin" {...register('role')} className="text-blue-600" />
                <span className="text-sm text-gray-700">{t('login.roleAdmin')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="productora" {...register('role')} className="text-blue-600" />
                <span className="text-sm text-gray-700">{t('login.roleProductora')}</span>
              </label>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('login.username')}</label>
            <input
              type="text"
              {...register('username', { required: t('form.required') })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              autoComplete="username"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('login.password')}</label>
            <input
              type="password"
              {...register('password', { required: t('form.required') })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              autoComplete="current-password"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Error general */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-2 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition font-medium mt-2"
          >
            {t('login.submit')}
          </button>
        </form>

        {/* Hint de usuarios */}
        <div className="mt-6 bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
          <p className="font-medium mb-1">Usuarios de prueba:</p>
          <p>Admin: <span className="font-mono">admin / admin123</span></p>
          <p>Productora: <span className="font-mono">gamboa / gamboa123</span></p>
          <p>Productora: <span className="font-mono">panoramix / pan123</span></p>
        </div>
      </div>
    </div>
  );
}
