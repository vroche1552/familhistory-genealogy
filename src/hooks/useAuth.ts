import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await api.login(email, password);
      localStorage.setItem('auth_token', response.data.token);
      setState({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      toast({
        title: t('auth.login_success'),
        description: t('auth.welcome_back'),
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: t('auth.login_error'),
        description: t('auth.invalid_credentials'),
        variant: 'destructive',
      });
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [navigate, toast, t]);

  const register = useCallback(async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await api.register(userData);
      localStorage.setItem('auth_token', response.data.token);
      setState({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      toast({
        title: t('auth.register_success'),
        description: t('auth.welcome_new_user'),
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: t('auth.register_error'),
        description: t('auth.registration_failed'),
        variant: 'destructive',
      });
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [navigate, toast, t]);

  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await api.logout();
      localStorage.removeItem('auth_token');
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      toast({
        title: t('auth.logout_success'),
        description: t('auth.see_you_soon'),
      });
      navigate('/');
    } catch (error) {
      toast({
        title: t('auth.logout_error'),
        description: t('auth.logout_failed'),
        variant: 'destructive',
      });
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [navigate, toast, t]);

  const checkAuth = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }
      // Here you would typically validate the token with your backend
      // For now, we'll just check if it exists
      setState({
        user: null, // You would get this from your backend
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    checkAuth,
  };
}; 