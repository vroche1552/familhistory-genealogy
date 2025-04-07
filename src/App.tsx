import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from '@/features/router/components/AppRoutes';
import { initializeApp } from '@/lib/init';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/features/theme/context/ThemeContext';
import { LanguageProvider } from '@/features/i18n/context/LanguageContext';
import { FamilyProvider } from '@/features/family-tree/context/FamilyContext';
import { Toaster } from '@/shared/components/ui/toaster';

/**
 * Root application component that sets up routing and initializes the app.
 */
const App: React.FC = () => {
  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <FamilyProvider>
              <AppRoutes />
              <Toaster />
            </FamilyProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
