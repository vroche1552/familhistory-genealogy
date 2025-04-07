import React from 'react';
import { useRoutes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { routes } from '../config/routes';

/**
 * AppRoutes component that renders the application routes within the main layout.
 */
export const AppRoutes: React.FC = () => {
  const routeElements = useRoutes(routes);

  return (
    <Layout>
      {routeElements}
    </Layout>
  );
}; 