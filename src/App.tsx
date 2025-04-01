import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider, ProtectedRoute } from '@/contexts/AuthContext';
import { FamilyProvider } from '@/contexts/FamilyContext';
import { Toaster } from 'sonner';
import { Layout } from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Tree from '@/pages/Tree';
import PersonProfile from '@/pages/PersonProfile';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
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
                    path="/tree"
                    element={
                      <ProtectedRoute>
                        <Tree />
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
    </BrowserRouter>
  );
}

export default App;
