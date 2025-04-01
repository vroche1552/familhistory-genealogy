import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LanguageSelect } from '@/components/language/LanguageSelect';

export const Header = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">{t('common.appName')}</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
                {t('nav.dashboard')}
              </Link>
              <Link to="/tree" className="text-sm font-medium hover:text-primary">
                {t('nav.familyTree')}
              </Link>
            </>
          ) : null}
        </nav>

        <div className="flex items-center space-x-4">
          <LanguageSelect />
          <ThemeToggle />
          {user ? (
            <Button variant="ghost" onClick={logout}>
              {t('auth.logout')}
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login">{t('auth.login')}</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">{t('auth.signup')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}; 