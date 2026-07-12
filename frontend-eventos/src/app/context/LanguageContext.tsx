'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import i18n from '../i18n';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function detectBrowserLanguage(): Language {
  const navLang = navigator.language?.slice(0, 2).toLowerCase();
  return navLang === 'en' ? 'en' : 'es';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Siempre inicializar en 'es' en el servidor para evitar problemas de hidratación
  const [language, setLanguageState] = useState<Language>('es');

  // Al montar en el cliente: 1) preferencia guardada manualmente, o 2) idioma del navegador
  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null;
    const initial = saved === 'es' || saved === 'en' ? saved : detectBrowserLanguage();
    setLanguageState(initial);
    i18n.changeLanguage(initial);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    i18n.changeLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
