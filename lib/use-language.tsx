'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { translations, Language } from './translations';
import { ELanguage } from '@/constants/enums';
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en | typeof translations.ru;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') {
      return ELanguage.en;
    }

    try {
      const stored = window.localStorage.getItem('language') as Language | null;
      if (stored === ELanguage.en || stored === ELanguage.ru) {
        return stored;
      }
    } catch {
      // Ignore storage errors and fall back to default
    }

    return ELanguage.en;
  });

  // Keep <html lang> in sync with current language for better a11y and SEO
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const langCode = language === ELanguage.ru ? 'ru' : 'en';
    document.documentElement.lang = langCode;

    try {
      window.localStorage.setItem('language', language);
    } catch {
      // Ignore storage errors
    }
  }, [language]);

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
