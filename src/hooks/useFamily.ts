import { useState, useCallback, useEffect } from 'react';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Family, Person } from '@/types';

interface FamilyState {
  families: Family[];
  currentFamily: Family | null;
  isLoading: boolean;
  error: string | null;
}

export const useFamily = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [state, setState] = useState<FamilyState>({
    families: [],
    currentFamily: null,
    isLoading: false,
    error: null,
  });

  const fetchFamilies = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.getFamilies();
      setState({
        families: response.data,
        currentFamily: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('family.fetch_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('family.fetch_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, t]);

  const fetchFamily = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.getFamily(id);
      setState(prev => ({
        ...prev,
        currentFamily: response.data,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('family.fetch_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('family.fetch_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, t]);

  const createFamily = useCallback(async (familyData: Omit<Family, 'id'>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.createFamily(familyData);
      setState(prev => ({
        ...prev,
        families: [...prev.families, response.data],
        currentFamily: response.data,
        isLoading: false,
        error: null,
      }));
      toast({
        title: t('common.success'),
        description: t('family.create_success'),
      });
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('family.create_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('family.create_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, t]);

  const updateFamily = useCallback(async (id: string, familyData: Partial<Family>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.updateFamily(id, familyData);
      setState(prev => ({
        ...prev,
        families: prev.families.map(f => (f.id === id ? response.data : f)),
        currentFamily: prev.currentFamily?.id === id ? response.data : prev.currentFamily,
        isLoading: false,
        error: null,
      }));
      toast({
        title: t('common.success'),
        description: t('family.update_success'),
      });
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('family.update_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('family.update_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, t]);

  const deleteFamily = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await api.deleteFamily(id);
      setState(prev => ({
        ...prev,
        families: prev.families.filter(f => f.id !== id),
        currentFamily: prev.currentFamily?.id === id ? null : prev.currentFamily,
        isLoading: false,
        error: null,
      }));
      toast({
        title: t('common.success'),
        description: t('family.delete_success'),
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('family.delete_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('family.delete_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, t]);

  const addPerson = useCallback(async (familyId: string, personData: Omit<Person, 'id'>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.createPerson(personData);
      const updatedFamily = {
        ...state.currentFamily!,
        members: [...state.currentFamily!.members, response.data],
      };
      setState(prev => ({
        ...prev,
        families: prev.families.map(f => (f.id === familyId ? updatedFamily : f)),
        currentFamily: updatedFamily,
        isLoading: false,
        error: null,
      }));
      toast({
        title: t('common.success'),
        description: t('family.person_added'),
      });
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('family.person_add_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('family.person_add_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [state.currentFamily, toast, t]);

  const updatePerson = useCallback(async (familyId: string, personId: string, personData: Partial<Person>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.updatePerson(personId, personData);
      const updatedFamily = {
        ...state.currentFamily!,
        members: state.currentFamily!.members.map(p => (p.id === personId ? response.data : p)),
      };
      setState(prev => ({
        ...prev,
        families: prev.families.map(f => (f.id === familyId ? updatedFamily : f)),
        currentFamily: updatedFamily,
        isLoading: false,
        error: null,
      }));
      toast({
        title: t('common.success'),
        description: t('family.person_updated'),
      });
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('family.person_update_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('family.person_update_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [state.currentFamily, toast, t]);

  const deletePerson = useCallback(async (familyId: string, personId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await api.deletePerson(personId);
      const updatedFamily = {
        ...state.currentFamily!,
        members: state.currentFamily!.members.filter(p => p.id !== personId),
      };
      setState(prev => ({
        ...prev,
        families: prev.families.map(f => (f.id === familyId ? updatedFamily : f)),
        currentFamily: updatedFamily,
        isLoading: false,
        error: null,
      }));
      toast({
        title: t('common.success'),
        description: t('family.person_deleted'),
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('family.person_delete_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('family.person_delete_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [state.currentFamily, toast, t]);

  // Initial data fetch
  useEffect(() => {
    fetchFamilies();
  }, [fetchFamilies]);

  return {
    ...state,
    fetchFamilies,
    fetchFamily,
    createFamily,
    updateFamily,
    deleteFamily,
    addPerson,
    updatePerson,
    deletePerson,
  };
}; 