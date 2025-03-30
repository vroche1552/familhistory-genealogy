
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Send, Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface PersonaData {
  name: string;
  biography: string;
  birthDate: string;
  birthPlace: string;
  country: string;
  occupation: string;
  education: string;
  timeline: {
    year: string;
    event: string;
    icon: string;
  }[];
}

interface Message {
  role: 'user' | 'persona';
  content: string;
}

interface PersonaChatProps {
  personaData: PersonaData;
}

const PersonaChat: React.FC<PersonaChatProps> = ({ personaData }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'persona', 
      content: `Hello, I am ${personaData.name}. You can ask me questions about my life and experiences.` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generatePersonaResponse = async (question: string) => {
    // In a real implementation, this would call an API endpoint
    // Here we're simulating a response based on the persona data
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a response based on the persona data
    let response = '';
    
    // Check for specific question types
    if (question.toLowerCase().includes('born') || question.toLowerCase().includes('birth')) {
      response = `I was born on ${personaData.birthDate} in ${personaData.birthPlace}.`;
    } 
    else if (question.toLowerCase().includes('work') || question.toLowerCase().includes('job') || question.toLowerCase().includes('profession')) {
      response = `I worked as ${personaData.occupation}. ${personaData.education ? `I studied at ${personaData.education}.` : ''}`;
    }
    else if (question.toLowerCase().includes('life') || question.toLowerCase().includes('tell me about yourself')) {
      response = personaData.biography;
    }
    else if (question.toLowerCase().includes('event') || question.toLowerCase().includes('happen') || question.toLowerCase().includes('important')) {
      const event = personaData.timeline[Math.floor(Math.random() * personaData.timeline.length)];
      response = `A significant event in my life was in ${event.year}: ${event.event}`;
    }
    else {
      response = `Thank you for your question. Based on what I know about my life, ${personaData.biography.substring(0, 100)}... Would you like to know more about a specific aspect of my life?`;
    }
    
    setIsLoading(false);
    return response;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    try {
      // Generate response
      const response = await generatePersonaResponse(input);
      
      // Add persona response
      const personaMessage: Message = { role: 'persona', content: response };
      setMessages(prev => [...prev, personaMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' 
          ? 'Une erreur s\'est produite lors de la génération de la réponse.' 
          : 'An error occurred while generating the response.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="border border-gray-200 bg-white text-black shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="h-5 w-5" />
          {language === 'fr' ? 'Conversation avec' : 'Conversation with'} {personaData.name}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <div className="h-[300px] overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] px-3 py-2 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-black text-white rounded-br-none' 
                    : 'bg-gray-100 text-black rounded-bl-none'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === 'persona' ? (
                    <>
                      <span className="font-medium">{personaData.name}</span>
                    </>
                  ) : (
                    <>
                      <span className="font-medium">{language === 'fr' ? 'Vous' : 'You'}</span>
                    </>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="max-w-[80%] px-3 py-2 rounded-lg bg-gray-100 text-black rounded-bl-none">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{personaData.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form 
          onSubmit={handleSubmit} 
          className="border-t border-gray-200 p-3 flex gap-2"
        >
          <Input
            type="text"
            placeholder={language === 'fr' ? 'Posez une question...' : 'Ask a question...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-white text-black border-gray-300 focus-visible:ring-gray-400"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="sm" 
            variant="default" 
            className="bg-black text-white"
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonaChat;
