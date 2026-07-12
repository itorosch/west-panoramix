'use client';

import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation('common');

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
      className="bg-white border border-gray-300 rounded-md px-2 py-1.5 text-sm text-gray-700 shadow-sm"
      aria-label={t('language.es') + ' / ' + t('language.en')}
    >
      <option value="es">{t('language.es')}</option>
      <option value="en">{t('language.en')}</option>
    </select>
  );
}
