import { useState, useCallback } from 'react';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { KeyFact } from '@/types';

interface KeyFactsState {
  facts: KeyFact[];
  isLoading: boolean;
  error: string | null;
}

export const useKeyFacts = (personId: string) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [state, setState] = useState<KeyFactsState>({
    facts: [],
    isLoading: false,
    error: null,
  });

  const fetchFacts = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.getKeyFacts(personId);
      setState({
        facts: response.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('keyFacts.fetch_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('keyFacts.fetch_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [personId, toast, t]);

  const addFact = useCallback(async (factData: Omit<KeyFact, 'id'>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.addKeyFact(personId, factData);
      setState(prev => ({
        ...prev,
        facts: [...prev.facts, response.data],
        isLoading: false,
        error: null,
      }));
      toast({
        title: t('common.success'),
        description: t('keyFacts.fact_added'),
      });
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('keyFacts.fact_add_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('keyFacts.fact_add_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [personId, toast, t]);

  const updateFact = useCallback(async (factId: string, factData: Partial<KeyFact>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.updateKeyFact(personId, factId, factData);
      setState(prev => ({
        ...prev,
        facts: prev.facts.map(f => (f.id === factId ? response.data : f)),
        isLoading: false,
        error: null,
      }));
      toast({
        title: t('common.success'),
        description: t('keyFacts.fact_updated'),
      });
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('keyFacts.fact_update_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('keyFacts.fact_update_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [personId, toast, t]);

  const deleteFact = useCallback(async (factId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await api.deleteKeyFact(personId, factId);
      setState(prev => ({
        ...prev,
        facts: prev.facts.filter(f => f.id !== factId),
        isLoading: false,
        error: null,
      }));
      toast({
        title: t('common.success'),
        description: t('keyFacts.fact_deleted'),
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('keyFacts.fact_delete_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('keyFacts.fact_delete_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [personId, toast, t]);

  return {
    ...state,
    fetchFacts,
    addFact,
    updateFact,
    deleteFact,
  };
}; 