import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'fr' | 'es' | 'de';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translation function - in a real app, this would use a proper i18n library
const translations: Record<Language, Record<string, string>> = {
  en: {
    'common.welcome': 'Welcome',
    'common.login': 'Login',
    'common.signup': 'Sign Up',
    'common.logout': 'Logout',
    'common.dashboard': 'Dashboard',
    'common.familyTree': 'Family Tree',
    'common.profile': 'Profile',
    'common.settings': 'Settings',
  },
  fr: {
    'common.welcome': 'Bienvenue',
    'common.login': 'Connexion',
    'common.signup': 'S\'inscrire',
    'common.logout': 'Déconnexion',
    'common.dashboard': 'Tableau de bord',
    'common.familyTree': 'Arbre généalogique',
    'common.profile': 'Profil',
    'common.settings': 'Paramètres',
  },
  es: {
    'common.welcome': 'Bienvenido',
    'common.login': 'Iniciar sesión',
    'common.signup': 'Registrarse',
    'common.logout': 'Cerrar sesión',
    'common.dashboard': 'Panel de control',
    'common.familyTree': 'Árbol genealógico',
    'common.profile': 'Perfil',
    'common.settings': 'Configuración',
  },
  de: {
    'common.welcome': 'Willkommen',
    'common.login': 'Anmelden',
    'common.signup': 'Registrieren',
    'common.logout': 'Abmelden',
    'common.dashboard': 'Dashboard',
    'common.familyTree': 'Stammbaum',
    'common.profile': 'Profil',
    'common.settings': 'Einstellungen',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'en';
  });

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage: (newLanguage: Language) => {
      setLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);
    },
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 