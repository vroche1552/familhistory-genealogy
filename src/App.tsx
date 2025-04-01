import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/features/theme/context/ThemeContext';
import { LanguageProvider } from '@/features/i18n/context/LanguageContext';
import { AuthProvider, ProtectedRoute } from '@/features/auth';
import { FamilyProvider } from '@/features/family-tree/context/FamilyContext';
import { Toaster } from '@/shared/components/ui/toaster';
import { Layout } from '@/shared/components/layout/Layout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Tree from '@/pages/Tree';
import PersonProfile from '@/pages/PersonProfile';
import FamilyMembers from '@/pages/FamilyMembers';
import NotFound from '@/pages/NotFound';
import { testSupabaseConnection } from '@/shared/lib/supabase';
import { testSupabaseSetup } from '@/shared/lib/supabase.test';

// Test Supabase connection on app start
testSupabaseConnection().then(success => {
  if (success) {
    console.log('Supabase is ready to use!');
  }
});

// Test Supabase setup
testSupabaseSetup().then(success => {
  if (success) {
    console.log('Supabase setup verified successfully!');
  } else {
    console.error('Supabase setup verification failed. Please check your configuration.');
  }
});

function App() {
  return (
    <Router>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <FamilyProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/tree/:treeId"
                    element={
                      <ProtectedRoute>
                        <Tree />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/tree/:treeId/members"
                    element={
                      <ProtectedRoute>
                        <FamilyMembers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/person/:id"
                    element={
                      <ProtectedRoute>
                        <PersonProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
              <Toaster />
            </FamilyProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
