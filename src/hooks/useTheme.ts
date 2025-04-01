import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
}

export const useTheme = () => {
  const [state, setState] = useState<ThemeState>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    return {
      theme: savedTheme || 'system',
      isDark: savedTheme === 'dark' || (savedTheme === 'system' && systemPrefersDark),
    };
  });

  const setTheme = useCallback((theme: Theme) => {
    setState(prev => ({
      theme,
      isDark: theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches),
    }));
    localStorage.setItem('theme', theme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(state.theme === 'light' ? 'dark' : 'light');
  }, [state.theme, setTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (state.theme === 'system') {
        setState(prev => ({
          ...prev,
          isDark: e.matches,
        }));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [state.theme]);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    if (state.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.isDark]);

  return {
    theme: state.theme,
    isDark: state.isDark,
    setTheme,
    toggleTheme,
  };
}; 