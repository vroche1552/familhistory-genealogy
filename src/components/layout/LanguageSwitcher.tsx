
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="cyber-button" 
      onClick={toggleLanguage}
    >
      <Globe className="h-4 w-4 mr-2" />
      {language === 'en' ? 'Français' : 'English'}
    </Button>
  );
};

export default LanguageSwitcher;
