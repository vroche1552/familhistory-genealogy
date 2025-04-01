import { useState, useCallback } from 'react';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChangelogEntry } from '@/types';

interface ChangelogState {
  entries: ChangelogEntry[];
  isLoading: boolean;
  error: string | null;
}

export const useChangelog = (personId: string) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [state, setState] = useState<ChangelogState>({
    entries: [],
    isLoading: false,
    error: null,
  });

  const fetchEntries = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.getChangelogEntries(personId);
      setState({
        entries: response.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('changelog.fetch_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('changelog.fetch_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [personId, toast, t]);

  const addEntry = useCallback(async (entryData: Omit<ChangelogEntry, 'id'>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.addChangelogEntry(personId, entryData);
      setState(prev => ({
        ...prev,
        entries: [...prev.entries, response.data],
        isLoading: false,
        error: null,
      }));
      toast({
        title: t('common.success'),
        description: t('changelog.entry_added'),
      });
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('changelog.entry_add_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('changelog.entry_add_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [personId, toast, t]);

  const updateEntry = useCallback(async (entryId: string, entryData: Partial<ChangelogEntry>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.updateChangelogEntry(personId, entryId, entryData);
      setState(prev => ({
        ...prev,
        entries: prev.entries.map(e => (e.id === entryId ? response.data : e)),
        isLoading: false,
        error: null,
      }));
      toast({
        title: t('common.success'),
        description: t('changelog.entry_updated'),
      });
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('changelog.entry_update_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('changelog.entry_update_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [personId, toast, t]);

  const deleteEntry = useCallback(async (entryId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await api.deleteChangelogEntry(personId, entryId);
      setState(prev => ({
        ...prev,
        entries: prev.entries.filter(e => e.id !== entryId),
        isLoading: false,
        error: null,
      }));
      toast({
        title: t('common.success'),
        description: t('changelog.entry_deleted'),
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('changelog.entry_delete_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('changelog.entry_delete_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [personId, toast, t]);

  const approveEntry = useCallback(async (entryId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.approveChangelogEntry(personId, entryId);
      setState(prev => ({
        ...prev,
        entries: prev.entries.map(e => (e.id === entryId ? response.data : e)),
        isLoading: false,
        error: null,
      }));
      toast({
        title: t('common.success'),
        description: t('changelog.entry_approved'),
      });
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('changelog.entry_approve_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('changelog.entry_approve_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [personId, toast, t]);

  const rejectEntry = useCallback(async (entryId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.rejectChangelogEntry(personId, entryId);
      setState(prev => ({
        ...prev,
        entries: prev.entries.map(e => (e.id === entryId ? response.data : e)),
        isLoading: false,
        error: null,
      }));
      toast({
        title: t('common.success'),
        description: t('changelog.entry_rejected'),
      });
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('changelog.entry_reject_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('changelog.entry_reject_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [personId, toast, t]);

  return {
    ...state,
    fetchEntries,
    addEntry,
    updateEntry,
    deleteEntry,
    approveEntry,
    rejectEntry,
  };
}; 