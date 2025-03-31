
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PersonaData {
  name: string;
  biography: string;
  birthDate: string;
  birthPlace: string;
  country: string;
  occupation: string;
  education: string;
}

interface PersonaChatProps {
  personaData: PersonaData;
}

const PersonaChat: React.FC<PersonaChatProps> = ({ personaData }) => {
  const { language } = useLanguage();

  return (
    <Card className="border border-gray-200 bg-white text-black shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {language === 'fr' ? 'À propos de' : 'About'} {personaData.name}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-4">
        <p className="text-sm text-gray-700">
          {personaData.biography}
        </p>
        <div className="mt-4 text-sm text-gray-500">
          {language === 'fr' 
            ? 'La fonctionnalité de chat a été désactivée.' 
            : 'Chat functionality has been disabled.'}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonaChat;
