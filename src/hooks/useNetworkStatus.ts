import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface NetworkState {
  isOnline: boolean;
  isOffline: boolean;
  type: string | null;
  effectiveType: string | null;
  rtt: number | null;
  downlink: number | null;
  saveData: boolean;
}

export const useNetworkStatus = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [state, setState] = useState<NetworkState>(() => ({
    isOnline: navigator.onLine,
    isOffline: !navigator.onLine,
    type: (navigator as any).connection?.type || null,
    effectiveType: (navigator as any).connection?.effectiveType || null,
    rtt: (navigator as any).connection?.rtt || null,
    downlink: (navigator as any).connection?.downlink || null,
    saveData: (navigator as any).connection?.saveData || false,
  }));

  const handleOnline = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOnline: true,
      isOffline: false,
    }));

    toast({
      title: t('network.online'),
      description: t('network.connection_restored'),
    });
  }, [toast, t]);

  const handleOffline = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOnline: false,
      isOffline: true,
    }));

    toast({
      title: t('network.offline'),
      description: t('network.connection_lost'),
      variant: 'destructive',
    });
  }, [toast, t]);

  const handleConnectionChange = useCallback(() => {
    const connection = (navigator as any).connection;
    if (!connection) return;

    setState(prev => ({
      ...prev,
      type: connection.type,
      effectiveType: connection.effectiveType,
      rtt: connection.rtt,
      downlink: connection.downlink,
      saveData: connection.saveData,
    }));

    if (connection.saveData) {
      toast({
        title: t('network.data_saver'),
        description: t('network.data_saver_enabled'),
      });
    }
  }, [toast, t]);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [handleOnline, handleOffline, handleConnectionChange]);

  const getConnectionSpeed = useCallback(() => {
    if (!state.downlink) return null;

    if (state.downlink >= 10) return 'fast';
    if (state.downlink >= 4) return 'medium';
    return 'slow';
  }, [state.downlink]);

  const getConnectionQuality = useCallback(() => {
    if (!state.effectiveType) return null;

    switch (state.effectiveType) {
      case '4g':
        return 'excellent';
      case '3g':
        return 'good';
      case '2g':
        return 'poor';
      default:
        return null;
    }
  }, [state.effectiveType]);

  return {
    ...state,
    getConnectionSpeed,
    getConnectionQuality,
  };
}; 