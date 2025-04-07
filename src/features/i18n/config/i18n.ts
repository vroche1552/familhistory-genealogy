import enTranslations from '@/locales/en.json';

export type TranslationKey = string;

export const defaultLanguage = 'en';

export const translations = {
  en: enTranslations
};

export type Language = keyof typeof translations;

// Helper function to get nested object value by dot notation
export const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((acc, part) => {
    if (acc === null || acc === undefined) return path;
    return acc[part];
  }, obj);
};

// Helper function to check if a translation exists
export const hasTranslation = (lang: Language, key: string): boolean => {
  try {
    const value = getNestedValue(translations[lang], key);
    return value !== undefined && value !== null && typeof value === 'string';
  } catch {
    return false;
  }
}; 