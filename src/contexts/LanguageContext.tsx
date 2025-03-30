
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr';

// Import translation files
import enTranslations from '../locales/en';
import frTranslations from '../locales/fr';

type Translations = typeof enTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get from localStorage or use browser language
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && ['en', 'fr'].includes(savedLanguage)) {
        return savedLanguage;
      }
      
      // Check browser language
      const browserLang = navigator.language.split('-')[0];
      return browserLang === 'fr' ? 'fr' : 'en';
    }
    return 'en'; // Default fallback
  });

  // Save to localStorage when language changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  }, [language]);

  // Get translations based on current language
  const translations = language === 'fr' ? frTranslations : enTranslations;

  // Translation function
  const t = (key: keyof Translations) => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
