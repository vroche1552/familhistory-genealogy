import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthLayout } from './AuthLayout';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      </AuthLayout>
    );
  }

  if (user) {
    // Redirect to the intended location (stored in state) or dashboard
    const intendedPath = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={intendedPath} replace />;
  }

  // Check if this is an auth page
  const isAuthPage = ['/login', '/signup', '/email-confirmation', '/auth/callback'].includes(location.pathname);

  return isAuthPage ? (
    <AuthLayout>{children}</AuthLayout>
  ) : (
    <>{children}</>
  );
}; 