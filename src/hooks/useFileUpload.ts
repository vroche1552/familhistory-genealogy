import { useState, useCallback } from 'react';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface UploadState {
  progress: number;
  isUploading: boolean;
  error: string | null;
  uploadedFiles: string[];
}

interface UploadOptions {
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
  maxFiles?: number;
}

export const useFileUpload = (options: UploadOptions = {}) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [state, setState] = useState<UploadState>({
    progress: 0,
    isUploading: false,
    error: null,
    uploadedFiles: [],
  });

  const validateFile = useCallback((file: File) => {
    if (options.maxFileSize && file.size > options.maxFileSize) {
      throw new Error(t('file_upload.file_too_large'));
    }

    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      throw new Error(t('file_upload.invalid_file_type'));
    }

    if (options.maxFiles && state.uploadedFiles.length >= options.maxFiles) {
      throw new Error(t('file_upload.max_files_reached'));
    }

    return true;
  }, [options, state.uploadedFiles.length, t]);

  const uploadFile = useCallback(async (file: File) => {
    try {
      validateFile(file);

      setState(prev => ({
        ...prev,
        isUploading: true,
        error: null,
        progress: 0,
      }));

      const formData = new FormData();
      formData.append('file', file);

      const response = await api.uploadFile(formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          );
          setState(prev => ({ ...prev, progress }));
        },
      });

      setState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        uploadedFiles: [...prev.uploadedFiles, response.data.url],
      }));

      toast({
        title: t('common.success'),
        description: t('file_upload.upload_success'),
      });

      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isUploading: false,
        error: error instanceof Error ? error.message : t('file_upload.upload_error'),
      }));

      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('file_upload.upload_error'),
        variant: 'destructive',
      });

      throw error;
    }
  }, [validateFile, toast, t]);

  const uploadMultipleFiles = useCallback(async (files: File[]) => {
    try {
      setState(prev => ({
        ...prev,
        isUploading: true,
        error: null,
        progress: 0,
      }));

      const uploadPromises = files.map(file => uploadFile(file));
      const results = await Promise.all(uploadPromises);

      setState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
      }));

      return results;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isUploading: false,
        error: error instanceof Error ? error.message : t('file_upload.upload_error'),
      }));

      throw error;
    }
  }, [uploadFile]);

  const removeFile = useCallback(async (fileUrl: string) => {
    try {
      setState(prev => ({ ...prev, isUploading: true, error: null }));
      await api.deleteFile(fileUrl);
      setState(prev => ({
        ...prev,
        isUploading: false,
        uploadedFiles: prev.uploadedFiles.filter(url => url !== fileUrl),
      }));
      toast({
        title: t('common.success'),
        description: t('file_upload.delete_success'),
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isUploading: false,
        error: error instanceof Error ? error.message : t('file_upload.delete_error'),
      }));
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('file_upload.delete_error'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, t]);

  const clearUploads = useCallback(() => {
    setState(prev => ({
      ...prev,
      uploadedFiles: [],
      error: null,
    }));
  }, []);

  return {
    ...state,
    uploadFile,
    uploadMultipleFiles,
    removeFile,
    clearUploads,
  };
}; 