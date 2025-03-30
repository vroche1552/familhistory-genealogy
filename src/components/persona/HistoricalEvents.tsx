
import { useState, useEffect } from 'react';
import { Calendar, Globe, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface HistoricalEvent {
  year: string;
  event: string;
  country: string;
}

interface HistoricalEventsProps {
  birthYear: string;
  deathYear?: string;
  country: string;
}

const HistoricalEvents: React.FC<HistoricalEventsProps> = ({ 
  birthYear, 
  deathYear = '', 
  country = 'France'
}) => {
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();
  const { toast } = useToast();

  const birthYearNum = parseInt(birthYear);
  const deathYearNum = deathYear ? parseInt(deathYear) : new Date().getFullYear();

  // French historical events
  const frenchHistoricalEvents: HistoricalEvent[] = [
    { year: "1789", event: "Début de la Révolution française avec la prise de la Bastille", country: "France" },
    { year: "1799", event: "Napoléon Bonaparte prend le pouvoir par un coup d'État", country: "France" },
    { year: "1804", event: "Napoléon Bonaparte devient empereur des Français", country: "France" },
    { year: "1815", event: "Défaite de Napoléon à Waterloo", country: "France" },
    { year: "1830", event: "Les Trois Glorieuses et début de la Monarchie de Juillet", country: "France" },
    { year: "1848", event: "Révolution de 1848 et proclamation de la Deuxième République", country: "France" },
    { year: "1852", event: "Napoléon III établit le Second Empire", country: "France" },
    { year: "1870", event: "Défaite française contre la Prusse à Sedan et chute du Second Empire", country: "France" },
    { year: "1871", event: "La Commune de Paris est réprimée", country: "France" },
    { year: "1889", event: "Exposition universelle de Paris et inauguration de la Tour Eiffel", country: "France" },
    { year: "1894", event: "Début de l'affaire Dreyfus", country: "France" },
    { year: "1905", event: "Loi de séparation des Églises et de l'État", country: "France" },
    { year: "1914", event: "Début de la Première Guerre mondiale", country: "France" },
    { year: "1918", event: "Armistice de la Première Guerre mondiale", country: "France" },
    { year: "1936", event: "Front populaire et premières congés payés", country: "France" },
    { year: "1939", event: "Début de la Seconde Guerre mondiale", country: "France" },
    { year: "1940", event: "Défaite française et occupation allemande", country: "France" },
    { year: "1944", event: "Libération de Paris", country: "France" },
    { year: "1945", event: "Fin de la Seconde Guerre mondiale", country: "France" },
    { year: "1946", event: "Début de la Quatrième République", country: "France" },
    { year: "1954", event: "Début de la guerre d'Algérie", country: "France" },
    { year: "1958", event: "Charles de Gaulle revient au pouvoir et établit la Cinquième République", country: "France" },
    { year: "1962", event: "Fin de la guerre d'Algérie", country: "France" },
    { year: "1968", event: "Mai 68 : protestations étudiantes et grèves", country: "France" },
    { year: "1969", event: "Démission du général de Gaulle", country: "France" },
    { year: "1981", event: "François Mitterrand devient le premier président socialiste de la Ve République", country: "France" },
    { year: "1995", event: "Jacques Chirac est élu président de la République", country: "France" },
    { year: "1998", event: "La France remporte la Coupe du monde de football", country: "France" },
    { year: "2002", event: "Passage à l'euro", country: "France" },
    { year: "2007", event: "Nicolas Sarkozy est élu président de la République", country: "France" },
    { year: "2012", event: "François Hollande est élu président de la République", country: "France" },
    { year: "2015", event: "Attentats terroristes à Paris", country: "France" },
    { year: "2017", event: "Emmanuel Macron devient président de la République", country: "France" },
    { year: "2018", event: "Début du mouvement des Gilets jaunes", country: "France" },
    { year: "2019", event: "Incendie de la cathédrale Notre-Dame de Paris", country: "France" },
    { year: "2020", event: "Début de la pandémie de COVID-19 en France", country: "France" }
  ];

  useEffect(() => {
    if (isVisible) {
      setIsLoading(true);
      
      // Filter events that occurred during the person's lifetime
      const relevantEvents = frenchHistoricalEvents.filter(event => {
        const eventYear = parseInt(event.year);
        return eventYear >= birthYearNum && eventYear <= deathYearNum;
      });
      
      // Sort by year
      const sortedEvents = relevantEvents.sort((a, b) => 
        parseInt(a.year) - parseInt(b.year)
      );
      
      // Simulate API delay
      setTimeout(() => {
        setEvents(sortedEvents);
        setIsLoading(false);
      }, 500);
    }
  }, [isVisible, birthYearNum, deathYearNum]);

  const handleLoadEvents = () => {
    setIsVisible(true);
  };

  return (
    <div className="mt-8">
      {!isVisible ? (
        <Button 
          onClick={handleLoadEvents} 
          variant="outline" 
          className="w-full border border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
        >
          <Globe className="mr-2 h-4 w-4" />
          {language === 'fr' 
            ? 'Afficher les événements historiques contemporains' 
            : 'Show contemporary historical events'}
        </Button>
      ) : (
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Globe className="mr-2 h-5 w-5 text-gray-600" />
              {language === 'fr' 
                ? 'Événements historiques contemporains' 
                : 'Contemporary Historical Events'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-6">
                <div className="animate-spin h-8 w-8 border-t-2 border-gray-500 rounded-full"></div>
              </div>
            ) : events.length > 0 ? (
              <div className="space-y-3">
                {events.map((event, index) => {
                  // Calculate age at the time of the event
                  const eventYear = parseInt(event.year);
                  const age = eventYear - birthYearNum;
                  
                  return (
                    <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-semibold flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-600" />
                          <span>{event.year}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {language === 'fr' 
                            ? `${age} ans` 
                            : `Age: ${age}`
                          }
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{event.event}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-4 text-gray-500">
                <Info className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>
                  {language === 'fr' 
                    ? 'Aucun événement historique majeur trouvé pour cette période.' 
                    : 'No major historical events found for this time period.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HistoricalEvents;
