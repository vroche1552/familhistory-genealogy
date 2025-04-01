import { useState, useCallback } from 'react';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { TimelineEvent } from '@/types';

interface TimelineState {
  events: TimelineEvent[];
  isLoading: boolean;
  error: string | null;
}

export const useTimeline = (personId: string) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [state, setState] = useState<TimelineState>({
    events: [],
    isLoading: false,
    error: null,
  });

  const fetchEvents = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.getTimelineEvents(personId);
      setState({
        events: response.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('timeline.fetch_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('timeline.fetch_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [personId, toast, t]);

  const addEvent = useCallback(async (eventData: Omit<TimelineEvent, 'id'>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.addTimelineEvent(personId, eventData);
      setState(prev => ({
        ...prev,
        events: [...prev.events, response.data],
        isLoading: false,
        error: null,
      }));
      toast({
        title: t('common.success'),
        description: t('timeline.event_added'),
      });
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('timeline.event_add_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('timeline.event_add_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [personId, toast, t]);

  const updateEvent = useCallback(async (eventId: string, eventData: Partial<TimelineEvent>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.updateTimelineEvent(personId, eventId, eventData);
      setState(prev => ({
        ...prev,
        events: prev.events.map(e => (e.id === eventId ? response.data : e)),
        isLoading: false,
        error: null,
      }));
      toast({
        title: t('common.success'),
        description: t('timeline.event_updated'),
      });
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('timeline.event_update_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('timeline.event_update_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [personId, toast, t]);

  const deleteEvent = useCallback(async (eventId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await api.deleteTimelineEvent(personId, eventId);
      setState(prev => ({
        ...prev,
        events: prev.events.filter(e => e.id !== eventId),
        isLoading: false,
        error: null,
      }));
      toast({
        title: t('common.success'),
        description: t('timeline.event_deleted'),
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('timeline.event_delete_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('timeline.event_delete_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [personId, toast, t]);

  return {
    ...state,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}; 