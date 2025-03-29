
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
      title: 'Fin de la Seconde Guerre mondiale',
      description: 'Libération de la France de l\'occupation allemande. De Gaulle devient chef du gouvernement provisoire.',
      category: 'political',
      impactLevel: 'high'
    },
    {
      year: '1946',
      title: 'Création de la Quatrième République',
      description: 'Adoption d\'une nouvelle constitution qui établit la Quatrième République en France.',
      category: 'political',
      impactLevel: 'high'
    },
    {
      year: '1954',
      title: 'Début de la Guerre d\'Algérie',
      description: 'Insurrection algérienne contre la domination coloniale française.',
      category: 'political',
      impactLevel: 'high'
    },
    {
      year: '1958',
      title: 'Cinquième République établie',
      description: 'Charles de Gaulle revient au pouvoir et établit la Cinquième République avec une présidence forte.',
      category: 'political',
      impactLevel: 'high'
    },
    {
      year: '1962',
      title: 'Fin de la Guerre d\'Algérie',
      description: 'Les accords d\'Évian mettent fin à huit années de guerre et accordent l\'indépendance à l\'Algérie.',
      category: 'political',
      impactLevel: 'high'
    },
    {
      year: '1968',
      title: 'Mai 68',
      description: 'Manifestations étudiantes et grèves générales à travers la France qui ont failli renverser le gouvernement.',
      category: 'political',
      impactLevel: 'high'
    },
    {
      year: '1969',
      title: 'Démission de De Gaulle',
      description: 'Charles de Gaulle démissionne après l\'échec d\'un référendum sur la réforme du Sénat.',
      category: 'political',
      impactLevel: 'medium'
    },
    {
      year: '1981',
      title: 'François Mitterrand élu',
      description: 'Premier président socialiste de la Cinquième République, il met en œuvre d\'importantes réformes.',
      category: 'political',
      impactLevel: 'medium'
    },
    {
      year: '1995',
      title: 'Jacques Chirac élu président',
      description: 'Chirac devient président après avoir battu le candidat socialiste Lionel Jospin.',
      category: 'political',
      impactLevel: 'medium'
    },
    {
      year: '2002',
      title: 'Introduction de l\'Euro',
      description: 'La France adopte l\'Euro comme monnaie officielle, remplaçant le Franc français.',
      category: 'political',
      impactLevel: 'high'
    },
    {
      year: '2015',
      title: 'Attentats terroristes à Paris',
      description: 'Série d\'attaques terroristes coordonnées, dont celle du Bataclan, causant 130 morts.',
      category: 'political',
      impactLevel: 'high'
    },
    {
      year: '2018',
      title: 'Mouvement des Gilets Jaunes',
      description: 'Mouvement de protestation populaire contre les inégalités économiques et sociales.',
      category: 'political',
      impactLevel: 'medium'
    },
    {
      year: '2019',
      title: 'Incendie de Notre-Dame',
      description: 'Un incendie ravage la cathédrale Notre-Dame de Paris, détruisant sa flèche et une partie de son toit.',
      category: 'cultural',
      impactLevel: 'high'
    },
    {
      year: '2020',
      title: 'Pandémie de COVID-19',
      description: 'La France impose un confinement national pour freiner la propagation du coronavirus.',
      category: 'scientific',
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

  // Sort events by year, oldest first
  const sortedEvents = [...relevantEvents].sort((a, b) => parseInt(a.year) - parseInt(b.year));

  return (
    <Card className="mt-6 border border-gray-800 bg-black">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Globe className="h-4 w-4 text-white mr-2" /> 
          {t('historical_events')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedEvents.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            {language === 'fr' 
              ? 'Aucun événement historique trouvé pour cette période.'
              : 'No historical events found for this time period.'}
          </p>
        ) : (
          <div className="space-y-4">
            {sortedEvents.map((event, index) => {
              // Calculate how old the person was during this historical event
              const eventYear = parseInt(event.year);
              const age = eventYear - birthYearNum;
              
              return (
                <div 
                  key={index} 
                  className="p-3 bg-gray-900 rounded-md border border-gray-800 hover:border-white/30 transition-colors"
                >
                  <div className="flex items-center mb-1">
                    <span className="text-white font-semibold mr-2">{event.year}</span>
                    <span className="font-medium">{event.title}</span>
                    <div className="ml-auto text-xs text-gray-400">
                      {t('age')}: <span className="text-white">{age} {t('years_old')}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{event.description}</p>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center text-xs text-gray-500">
                      {getCategoryIcon(event.category)}
                      <span className="ml-1 capitalize">{event.category}</span>
                    </div>
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
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoricalEvents;
