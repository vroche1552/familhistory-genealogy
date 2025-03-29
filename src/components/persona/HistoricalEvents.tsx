
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Globe, Flag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HistoricalEvent {
  year: string;
  title: string;
  description: string;
  category: 'political' | 'cultural' | 'scientific';
  impactLevel?: 'high' | 'medium' | 'low';
}

// This is mock data - in a real app, this would be fetched from an API
const mockHistoricalEvents: Record<string, HistoricalEvent[]> = {
  'France': [
    {
      year: '1945',
      title: 'End of World War II',
      description: 'Liberation of France from German occupation. De Gaulle becomes head of the provisional government.',
      category: 'political',
      impactLevel: 'high'
    },
    {
      year: '1958',
      title: 'Fifth Republic Established',
      description: 'Charles de Gaulle returns to power and establishes the Fifth Republic with a strong presidency.',
      category: 'political',
      impactLevel: 'high'
    },
    {
      year: '1968',
      title: 'May 1968 Events',
      description: 'Student protests and general strikes across France nearly toppled the government.',
      category: 'political',
      impactLevel: 'high'
    },
    {
      year: '1981',
      title: 'François Mitterrand Elected',
      description: 'First Socialist President of the Fifth Republic implements major reforms.',
      category: 'political',
      impactLevel: 'medium'
    }
  ],
  'United States': [
    {
      year: '1945',
      title: 'End of World War II',
      description: 'The United States emerges as a superpower after dropping atomic bombs on Japan.',
      category: 'political',
      impactLevel: 'high'
    },
    {
      year: '1963',
      title: 'Kennedy Assassination',
      description: 'President John F. Kennedy is assassinated in Dallas, Texas.',
      category: 'political',
      impactLevel: 'high'
    },
    {
      year: '1969',
      title: 'Moon Landing',
      description: 'Neil Armstrong and Buzz Aldrin become the first humans to walk on the moon.',
      category: 'scientific',
      impactLevel: 'high'
    },
    {
      year: '1974',
      title: 'Nixon Resignation',
      description: 'President Nixon resigns following the Watergate scandal.',
      category: 'political',
      impactLevel: 'high'
    }
  ]
};

interface HistoricalEventsProps {
  birthYear?: string;
  deathYear?: string;
  country?: string;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'political':
      return <Flag className="h-4 w-4" />;
    case 'cultural':
      return <BookOpen className="h-4 w-4" />;
    case 'scientific':
      return <Globe className="h-4 w-4" />;
    default:
      return <Globe className="h-4 w-4" />;
  }
};

const HistoricalEvents: React.FC<HistoricalEventsProps> = ({ 
  birthYear = '1950',
  deathYear = '',
  country = 'France'
}) => {
  const { t, language } = useLanguage();
  
  // Get events for the country and filter by years
  const events = mockHistoricalEvents[country] || [];
  const birthYearNum = parseInt(birthYear);
  const deathYearNum = deathYear ? parseInt(deathYear) : new Date().getFullYear();
  
  const relevantEvents = events.filter(event => {
    const eventYear = parseInt(event.year);
    return eventYear >= birthYearNum && eventYear <= deathYearNum;
  });

  return (
    <Card className="cyber-card mt-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Globe className="h-4 w-4 text-cyber-accent mr-2" /> 
          {t('historical_events')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {relevantEvents.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            {language === 'fr' 
              ? 'Aucun événement historique trouvé pour cette période.'
              : 'No historical events found for this time period.'}
          </p>
        ) : (
          <div className="space-y-4">
            {relevantEvents.map((event, index) => (
              <div 
                key={index} 
                className="p-3 bg-cyber-dark/50 rounded-md border border-cyber-border/30 hover:border-cyber-accent/30 transition-colors"
              >
                <div className="flex items-center mb-1">
                  <span className="text-cyber-accent font-semibold mr-2">{event.year}</span>
                  <span className="font-medium">{event.title}</span>
                  <div className={`ml-auto px-2 py-0.5 rounded text-xs ${
                    event.impactLevel === 'high' 
                      ? 'bg-red-500/20 text-red-300' 
                      : event.impactLevel === 'medium' 
                        ? 'bg-yellow-500/20 text-yellow-300' 
                        : 'bg-green-500/20 text-green-300'
                  }`}>
                    {language === 'fr' 
                      ? (event.impactLevel === 'high' ? 'Impact élevé' : event.impactLevel === 'medium' ? 'Impact moyen' : 'Impact faible')
                      : `${event.impactLevel === 'high' ? 'High' : event.impactLevel === 'medium' ? 'Medium' : 'Low'} impact`}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                <div className="flex items-center mt-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    {getCategoryIcon(event.category)}
                    <span className="ml-1 capitalize">{event.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoricalEvents;
