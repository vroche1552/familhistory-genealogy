import { useState, useCallback, useEffect } from 'react';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export const useNotifications = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [state, setState] = useState<NotificationsState>({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
  });

  const fetchNotifications = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.getNotifications();
      const notifications = response.data;
      const unreadCount = notifications.filter(n => !n.read).length;
      setState({
        notifications,
        unreadCount,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('notifications.fetch_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('notifications.fetch_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, t]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.markNotificationAsRead(notificationId);
      setState(prev => {
        const notifications = prev.notifications.map(n =>
          n.id === notificationId ? response.data : n
        );
        const unreadCount = notifications.filter(n => !n.read).length;
        return {
          ...prev,
          notifications,
          unreadCount,
          isLoading: false,
          error: null,
        };
      });
      toast({
        title: t('common.success'),
        description: t('notifications.mark_read_success'),
      });
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('notifications.mark_read_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('notifications.mark_read_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, t]);

  const markAllAsRead = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.markAllNotificationsAsRead();
      setState({
        notifications: response.data,
        unreadCount: 0,
        isLoading: false,
        error: null,
      });
      toast({
        title: t('common.success'),
        description: t('notifications.mark_all_read_success'),
      });
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('notifications.mark_all_read_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('notifications.mark_all_read_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, t]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await api.deleteNotification(notificationId);
      setState(prev => {
        const notifications = prev.notifications.filter(n => n.id !== notificationId);
        const unreadCount = notifications.filter(n => !n.read).length;
        return {
          ...prev,
          notifications,
          unreadCount,
          isLoading: false,
          error: null,
        };
      });
      toast({
        title: t('common.success'),
        description: t('notifications.delete_success'),
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('notifications.delete_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('notifications.delete_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, t]);

  const deleteAllNotifications = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await api.deleteAllNotifications();
      setState({
        notifications: [],
        unreadCount: 0,
        isLoading: false,
        error: null,
      });
      toast({
        title: t('common.success'),
        description: t('notifications.delete_all_success'),
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('notifications.delete_all_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('notifications.delete_all_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, t]);

  // Initial data fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    ...state,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  };
}; 