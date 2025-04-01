import { useState, useCallback } from 'react';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Document } from '@/types';

interface DocumentState {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
}

export const useDocuments = (personId: string) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [state, setState] = useState<DocumentState>({
    documents: [],
    isLoading: false,
    error: null,
  });

  const fetchDocuments = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.getDocuments(personId);
      setState({
        documents: response.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('documents.fetch_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('documents.fetch_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [personId, toast, t]);

  const uploadDocument = useCallback(async (file: File) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await api.uploadDocument(personId, file);
      setState(prev => ({
        ...prev,
        documents: [...prev.documents, response.data],
        isLoading: false,
        error: null,
      }));
      toast({
        title: t('common.success'),
        description: t('documents.upload_success'),
      });
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('documents.upload_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('documents.upload_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [personId, toast, t]);

  const deleteDocument = useCallback(async (documentId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await api.deleteDocument(personId, documentId);
      setState(prev => ({
        ...prev,
        documents: prev.documents.filter(d => d.id !== documentId),
        isLoading: false,
        error: null,
      }));
      toast({
        title: t('common.success'),
        description: t('documents.delete_success'),
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t('documents.delete_error'),
      }));
      toast({
        title: t('common.error'),
        description: t('documents.delete_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [personId, toast, t]);

  return {
    ...state,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
  };
}; 