
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

// Create context with a meaningful default value to avoid null check issues
const defaultContextValue: LanguageContextType = {
  language: 'en',
  setLanguage: () => {},
  t: (key) => String(key)
};

const LanguageContext = createContext<LanguageContextType>(defaultContextValue);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  // Initialize language from localStorage or browser preferences
  useEffect(() => {
    try {
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
    } catch (error) {
      console.error('Error initializing language:', error);
    }
  }, []);

  // Save to localStorage when language changes
  useEffect(() => {
    try {
      localStorage.setItem('language', language);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  }, [language]);

  // Get translations based on current language
  const translations = language === 'fr' ? frTranslations : enTranslations;

  // Translation function
  const t = (key: keyof Translations) => {
    return translations[key] || key;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
