import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { PublicRoute } from '@/features/auth/components/PublicRoute';

// Page imports
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Tree from '@/pages/Tree';
import PersonProfile from '@/pages/PersonProfile';
import FamilyMembers from '@/pages/FamilyMembers';
import NotFound from '@/pages/NotFound';
import FamilyTreePage from '@/features/family-tree/pages/FamilyTreePage';
import FamilyMemberListPage from '@/features/family-tree/pages/FamilyMemberListPage';
import RelationshipManagerPage from '@/features/family-tree/pages/RelationshipManagerPage';
import EmailConfirmation from '@/pages/EmailConfirmation';
import AuthCallback from '@/pages/AuthCallback';
import AddFamilyMember from '@/features/family-tree/pages/AddFamilyMember';

// Define public routes that don't require authentication
const publicRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <PublicRoute><Login /></PublicRoute>
  },
  {
    path: '/signup',
    element: <PublicRoute><Signup /></PublicRoute>
  },
  {
    path: '/email-confirmation',
    element: <PublicRoute><EmailConfirmation /></PublicRoute>
  },
  {
    path: '/auth/callback',
    element: <PublicRoute><AuthCallback /></PublicRoute>
  }
];

// Define protected routes that require authentication
const protectedRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
  },
  {
    path: '/tree/add',
    element: <ProtectedRoute><AddFamilyMember /></ProtectedRoute>
  },
  {
    path: '/tree/:treeId',
    element: <ProtectedRoute><Tree /></ProtectedRoute>
  },
  {
    path: '/tree/:treeId/members',
    element: <ProtectedRoute><FamilyMembers /></ProtectedRoute>
  },
  {
    path: '/person/:id',
    element: <ProtectedRoute><PersonProfile /></ProtectedRoute>
  },
  {
    path: '/family-tree',
    element: <ProtectedRoute><FamilyTreePage /></ProtectedRoute>
  },
  {
    path: '/family-members',
    element: <ProtectedRoute><FamilyMemberListPage /></ProtectedRoute>
  },
  {
    path: '/relationships',
    element: <ProtectedRoute><RelationshipManagerPage /></ProtectedRoute>
  }
];

// Combine all routes
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <PublicRoute><Home /></PublicRoute>
  },
  ...publicRoutes,
  ...protectedRoutes,
  {
    path: '*',
    element: <NotFound />
  }
]; 