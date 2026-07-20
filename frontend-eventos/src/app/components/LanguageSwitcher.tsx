'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LanguageSwitcher() {
  const t = useTranslations('nav');
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState('es');

  useEffect(() => {
    const match = document.cookie.match(/locale=([^;]+)/);
    if (match) setCurrentLocale(match[1]);
  }, []);

  const changeLanguage = (locale: string) => {
    // Guardar en cookie y recargar para que SSR tome el nuevo idioma
    document.cookie = `locale=${locale}; path=/; max-age=31536000`;
    setCurrentLocale(locale);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-400 mr-1">{t('language')}:</span>
      <button
        onClick={() => changeLanguage('es')}
        className={`px-2 py-1 text-xs rounded font-medium transition ${
          currentLocale === 'es'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        ES
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 text-xs rounded font-medium transition ${
          currentLocale === 'en'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        EN
      </button>
    </div>
  );
}
