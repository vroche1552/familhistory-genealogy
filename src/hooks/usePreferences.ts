import { useState, useCallback, useEffect } from 'react';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    changes: boolean;
    updates: boolean;
  };
  privacy: {
    showBirthDate: boolean;
    showDeathDate: boolean;
    showLocation: boolean;
    showDocuments: boolean;
  };
  display: {
    dateFormat: string;
    timeFormat: string;
    showAge: boolean;
    showPhotos: boolean;
  };
}

interface PreferencesState {
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
}

const defaultPreferences: UserPreferences = {
  language: 'en',
  theme: 'system',
  notifications: {
    email: true,
    push: true,
    changes: true,
    updates: true,
  },
  privacy: {
    showBirthDate: true,
    showDeathDate: true,
    showLocation: true,
    showDocuments: true,
  },
  display: {
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    showAge: true,
    showPhotos: true,
  },
};

export const usePreferences = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [state, setState] = useState<PreferencesState>({
    preferences: defaultPreferences,
    isLoading: false,
    error: null,
  });

  const fetchPreferences = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.getUserPreferences();
      setState({
        preferences: response.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('preferences.fetch_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('preferences.fetch_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, t]);

  const updatePreferences = useCallback(async (preferences: Partial<UserPreferences>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.updateUserPreferences(preferences);
      setState(prev => ({
        ...prev,
        preferences: { ...prev.preferences, ...response.data },
        isLoading: false,
        error: null,
      }));
      toast({
        title: t('common.success'),
        description: t('preferences.update_success'),
      });
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('preferences.update_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('preferences.update_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, t]);

  const resetPreferences = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await api.resetUserPreferences();
      setState({
        preferences: defaultPreferences,
        isLoading: false,
        error: null,
      });
      toast({
        title: t('common.success'),
        description: t('preferences.reset_success'),
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('preferences.reset_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('preferences.reset_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, t]);

  // Initial data fetch
  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return {
    ...state,
    fetchPreferences,
    updatePreferences,
    resetPreferences,
  };
}; 