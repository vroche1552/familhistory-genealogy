import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/features/i18n/context/LanguageContext';
import { useTheme } from '@/features/theme/context/ThemeContext';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LanguageSelect } from '@/components/language/LanguageSelect';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className={`flex min-h-screen flex-col bg-background text-foreground ${theme}`}>
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">{t('common.appName')}</span>
          </Link>
          <div className="flex items-center space-x-4">
            <LanguageSelect />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          {children}
        </div>
      </main>
    </div>
  );
}; 