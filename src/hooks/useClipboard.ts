import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface ClipboardState {
  text: string;
  isCopied: boolean;
  error: string | null;
}

export const useClipboard = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [state, setState] = useState<ClipboardState>({
    text: '',
    isCopied: false,
    error: null,
  });

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      if (!navigator.clipboard) {
        throw new Error(t('clipboard.not_supported'));
      }

      await navigator.clipboard.writeText(text);
      setState(prev => ({
        ...prev,
        text,
        isCopied: true,
        error: null,
      }));

      toast({
        title: t('common.success'),
        description: t('clipboard.copy_success'),
      });

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setState(prev => ({ ...prev, isCopied: false }));
      }, 2000);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : t('clipboard.copy_error'),
      }));

      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('clipboard.copy_error'),
        variant: 'destructive',
      });
    }
  }, [toast, t]);

  const pasteFromClipboard = useCallback(async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error(t('clipboard.not_supported'));
      }

      const text = await navigator.clipboard.readText();
      setState(prev => ({
        ...prev,
        text,
        error: null,
      }));

      return text;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : t('clipboard.paste_error'),
      }));

      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('clipboard.paste_error'),
        variant: 'destructive',
      });

      throw error;
    }
  }, [toast, t]);

  const clearClipboard = useCallback(async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error(t('clipboard.not_supported'));
      }

      await navigator.clipboard.writeText('');
      setState(prev => ({
        ...prev,
        text: '',
        isCopied: false,
        error: null,
      }));

      toast({
        title: t('common.success'),
        description: t('clipboard.clear_success'),
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : t('clipboard.clear_error'),
      }));

      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('clipboard.clear_error'),
        variant: 'destructive',
      });
    }
  }, [toast, t]);

  return {
    ...state,
    copyToClipboard,
    pasteFromClipboard,
    clearClipboard,
  };
}; 