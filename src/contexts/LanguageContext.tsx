
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
  // Use a simple initialization to avoid complex logic during the initial render
  const [language, setLanguage] = useState<Language>('en');
  
  // Initialize language from localStorage or browser preferences in an effect
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'fr'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
      return;
    }
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'fr') {
      setLanguage('fr');
    }
  }, []);

  // Save to localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
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
