import React from 'react';
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
import FamilyTreePage from '@/features/family-tree/pages/FamilyTreePage';
import FamilyMemberListPage from '@/features/family-tree/pages/FamilyMemberListPage';
import RelationshipManagerPage from '@/features/family-tree/pages/RelationshipManagerPage';

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

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <FamilyProvider>
            <Router>
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
                  <Route
                    path="/family-tree"
                    element={
                      <ProtectedRoute>
                        <FamilyTreePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/family-members"
                    element={
                      <ProtectedRoute>
                        <FamilyMemberListPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/relationships"
                    element={
                      <ProtectedRoute>
                        <RelationshipManagerPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
              <Toaster />
            </Router>
          </FamilyProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
