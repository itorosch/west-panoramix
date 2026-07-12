import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEs from './locales/es/common.json';
import eventoEs from './locales/es/evento.json';
import commonEn from './locales/en/common.json';
import eventoEn from './locales/en/evento.json';

const resources = {
  es: {
    common: commonEs,
    evento: eventoEs,
  },
  en: {
    common: commonEn,
    evento: eventoEn,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'es',
  fallbackLng: 'es',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});

export default i18n;
