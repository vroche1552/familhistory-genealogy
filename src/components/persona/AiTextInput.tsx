import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface AiTextInputProps {
  onUpdate: (updates: {
    birthDate?: Date;
    deathDate?: Date;
    birthPlace?: { city: string; country: string };
    deathPlace?: { city: string; country: string };
    occupation?: string;
    education?: Array<{
      institution: string;
      degree: string;
      startDate: Date;
      endDate?: Date;
      description?: string;
    }>;
    biography?: string;
    keyFacts?: string[];
  }) => void;
}

const AiTextInput: React.FC<AiTextInputProps> = ({ onUpdate }) => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const processText = async () => {
    if (!text.trim()) return;

    setIsProcessing(true);
    try {
      // TODO: Replace with actual AI API call
      const response = await fetch('/api/process-persona-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process text');
      }

      const result = await response.json();
      onUpdate(result);
      
      toast({
        title: t('information_processed'),
        description: t('information_processed_description'),
      });
      
      setText('');
    } catch (error) {
      toast({
        title: t('error'),
        description: t('error_processing_text'),
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder={t('enter_persona_info')}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[100px]"
      />
      <div className="flex justify-end">
        <Button
          onClick={processText}
          disabled={isProcessing || !text.trim()}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('processing')}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {t('process')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AiTextInput; 