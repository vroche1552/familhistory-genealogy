
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Calendar, 
  MapPin, 
  Briefcase, 
  FileText, 
  Image, 
  User, 
  Users,
  Edit,
  Trees,
  Heart,
  GraduationCap,
  Brain,
  Globe,
  Quote,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import HistoricalEvents from '@/components/persona/HistoricalEvents';
import FileDropZone from '@/components/persona/FileDropZone';
import PersonaChat from '@/components/persona/PersonaChat';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Mock data for demo purposes
const personData = {
  id: '1',
  name: 'Jean Dupont',
  birthDate: '12 Avril 1950',
  birthPlace: 'Paris, France',
  country: 'France',
  deathDate: '',
  deathPlace: '',
  occupation: 'Architecte',
  education: 'École des Beaux-Arts',
  biography: 'Jean Dupont est né à Paris de Jacques et Marie Dupont. Il a étudié l\'architecture à l\'École des Beaux-Arts et a conçu plusieurs bâtiments notables dans la région parisienne. Il a épousé Anne Martin en 1975 et ils ont eu deux enfants ensemble.',
  highlights: [
    "J'ai conçu la médiathèque de Saint-Denis en 1985, un bâtiment qui a reçu le prix d'excellence architecturale.",
    "Pendant les événements de Mai 68, j'ai participé aux manifestations étudiantes tout en poursuivant mes études d'architecture.",
    "J'ai vécu la transition de la planche à dessin aux logiciels de CAO dans les années 90, révolutionnant ma façon de travailler."
  ],
  images: [
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=600&auto=format',
    'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=600&auto=format'
  ],
  documents: [
    { name: 'Certificat de naissance', type: 'certificate', date: '1950' },
    { name: 'Licence de mariage', type: 'certificate', date: '1975' },
    { name: 'Licence d\'architecture', type: 'license', date: '1978' }
  ],
  timeline: [
    { year: '1950', event: 'Né à Paris, France', icon: 'User' },
    { year: '1968', event: 'Diplômé du Lycée Henri-IV', icon: 'GraduationCap' },
    { year: '1968', event: 'Témoins des événements de Mai 68 à Paris', icon: 'Calendar' },
    { year: '1972', event: 'Diplômé de l\'École des Beaux-Arts avec un diplôme en Architecture', icon: 'GraduationCap' },
    { year: '1975', event: 'Mariage avec Anne Martin', icon: 'Heart' },
    { year: '1977', event: 'Premier enfant né - Michel Dupont', icon: 'User' },
    { year: '1980', event: 'Deuxième enfant né - Sophie Dupont', icon: 'User' },
    { year: '1981', event: 'A vécu l\'élection de François Mitterrand comme président', icon: 'Calendar' },
    { year: '1985', event: 'Création du cabinet d\'architecture Dupont', icon: 'Briefcase' },
    { year: '1989', event: 'A assisté à la célébration du bicentenaire de la Révolution française', icon: 'Calendar' },
    { year: '1998', event: 'A célébré la victoire de la France à la Coupe du Monde', icon: 'Calendar' },
    { year: '2000', event: 'Expansion du cabinet d\'architecture à Lyon', icon: 'Briefcase' }
  ],
  relations: {
    parents: [
      { id: '5', name: 'Jacques Dupont', birthYear: '1920', deathYear: '1990' },
      { id: '6', name: 'Marie Dupont', birthYear: '1925', deathYear: '1995' }
    ],
    partners: [
      { id: '2', name: 'Anne Dupont (Martin)', birthYear: '1953' }
    ],
    children: [
      { id: '3', name: 'Michel Dupont', birthYear: '1977' },
      { id: '4', name: 'Sophie Dupont', birthYear: '1980' }
    ],
    siblings: [
      { id: '7', name: 'Robert Dupont', birthYear: '1952' }
    ]
  }
};

const TimelineIcon = ({ icon }: { icon: string }) => {
  switch(icon) {
    case 'User':
      return <User className="h-4 w-4" />;
    case 'Heart':
      return <Heart className="h-4 w-4" />;
    case 'GraduationCap':
      return <GraduationCap className="h-4 w-4" />;
    case 'Briefcase':
      return <Briefcase className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

const Persona = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [biography, setBiography] = useState(personData.biography);
  const [activeHighlight, setActiveHighlight] = useState(0);
  const person = personData; // In a real app, fetch data based on id
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  const handleAddToBio = (text: string) => {
    setBiography(prev => prev + ' ' + text);
    toast({
      title: language === 'fr' ? 'Biographie mise à jour' : 'Biography Updated',
      description: language === 'fr' 
        ? 'Les informations ont été ajoutées à la biographie.' 
        : 'Information has been added to the biography.'
    });
  };

  // Extract birth year for historical events
  const birthYear = person.birthDate.split(' ')[2] || '1950';
  const deathYear = person.deathDate ? person.deathDate.split(' ')[2] : '';
  
  // Rotate through highlights automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHighlight(prev => (prev + 1) % person.highlights.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [person.highlights.length]);
  
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Header with actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold">{person.name}</h1>
              <div className="flex items-center text-gray-600 mt-1">
                <Calendar className="h-4 w-4 mr-1" /> {person.birthDate} 
                {person.birthPlace && (
                  <>
                    <MapPin className="h-4 w-4 mx-1 ml-3" /> {person.birthPlace}
                  </>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Link to={`/tree?focus=${id}`}>
                <Button variant="outline" className="border border-gray-300 hover:bg-gray-100 text-black">
                  <Trees className="h-4 w-4 mr-2" /> {t('view_in_tree')}
                </Button>
              </Link>
              <Button className="bg-black hover:bg-gray-800 text-white">
                <Edit className="h-4 w-4 mr-2" /> {t('edit')} {language === 'fr' ? 'Profil' : 'Profile'}
              </Button>
            </div>
          </div>
          
          {/* Life highlight card */}
          <Card className="mb-8 border border-gray-200 bg-gray-50 overflow-hidden">
            <div className="relative h-auto">
              <motion.div 
                className="p-6"
                key={activeHighlight}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center mb-3">
                  <Sparkles className="h-5 w-5 text-gray-700 mr-2" />
                  <h2 className="text-xl font-semibold">{language === 'fr' ? 'Moment marquant' : 'Life Highlight'}</h2>
                </div>
                <div className="flex items-start">
                  <Quote className="h-8 w-8 text-gray-300 mr-3 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 italic">{person.highlights[activeHighlight]}</p>
                </div>
                <div className="flex justify-center mt-4">
                  {person.highlights.map((_, index) => (
                    <button 
                      key={index}
                      onClick={() => setActiveHighlight(index)}
                      className={`w-2 h-2 mx-1 rounded-full ${index === activeHighlight ? 'bg-black' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </Card>
          
          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Images and info */}
            <div className="col-span-1">
              <Card className="overflow-hidden mb-6 border border-gray-200 bg-white">
                <div className="relative">
                  <img 
                    src={person.images[activeImageIndex]} 
                    alt={person.name} 
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-center gap-2 bg-gradient-to-t from-black/70 to-transparent">
                    {person.images.map((img, index) => (
                      <button 
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${index === activeImageIndex ? 'bg-white' : 'bg-gray-400'}`}
                      />
                    ))}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {person.occupation && (
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 text-gray-600 mr-2" />
                        <span>{t('occupation')}: {person.occupation}</span>
                      </div>
                    )}
                    
                    {person.education && (
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 text-gray-600 mr-2" />
                        <span>{t('education')}: {person.education}</span>
                      </div>
                    )}
                    
                    {person.country && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-gray-600 mr-2" />
                        <span>{language === 'fr' ? 'Pays' : 'Country'}: {person.country}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Family relationships */}
              <Card className="mb-6 border border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-4 w-4 text-gray-600 mr-2" /> {language === 'fr' ? 'Relations Familiales' : 'Family Relationships'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Parents */}
                  {person.relations.parents.length > 0 && (
                    <div>
                      <h4 className="text-sm text-gray-500 mb-2">{t('parents')}</h4>
                      <div className="space-y-2">
                        {person.relations.parents.map(parent => (
                          <Link 
                            key={parent.id} 
                            to={`/persona/${parent.id}`}
                            className="flex items-center py-1 px-2 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <User className="h-4 w-4 text-gray-600 mr-2" />
                            <span>{parent.name}</span>
                            {(parent.birthYear || parent.deathYear) && (
                              <span className="text-xs text-gray-500 ml-2">
                                ({parent.birthYear} - {parent.deathYear || (language === 'fr' ? 'Présent' : 'Present')})
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Partners */}
                  {person.relations.partners.length > 0 && (
                    <div>
                      <h4 className="text-sm text-gray-500 mb-2">{t('partners')}</h4>
                      <div className="space-y-2">
                        {person.relations.partners.map(partner => (
                          <Link 
                            key={partner.id} 
                            to={`/persona/${partner.id}`}
                            className="flex items-center py-1 px-2 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <Heart className="h-4 w-4 text-gray-600 mr-2" />
                            <span>{partner.name}</span>
                            {partner.birthYear && (
                              <span className="text-xs text-gray-500 ml-2">
                                ({language === 'fr' ? 'né(e) en' : 'b.'} {partner.birthYear})
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Children */}
                  {person.relations.children.length > 0 && (
                    <div>
                      <h4 className="text-sm text-gray-500 mb-2">{t('children')}</h4>
                      <div className="space-y-2">
                        {person.relations.children.map(child => (
                          <Link 
                            key={child.id} 
                            to={`/persona/${child.id}`}
                            className="flex items-center py-1 px-2 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <User className="h-4 w-4 text-gray-600 mr-2" />
                            <span>{child.name}</span>
                            {child.birthYear && (
                              <span className="text-xs text-gray-500 ml-2">
                                ({language === 'fr' ? 'né(e) en' : 'b.'} {child.birthYear})
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Siblings */}
                  {person.relations.siblings.length > 0 && (
                    <div>
                      <h4 className="text-sm text-gray-500 mb-2">{t('siblings')}</h4>
                      <div className="space-y-2">
                        {person.relations.siblings.map(sibling => (
                          <Link 
                            key={sibling.id} 
                            to={`/persona/${sibling.id}`}
                            className="flex items-center py-1 px-2 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <User className="h-4 w-4 text-gray-600 mr-2" />
                            <span>{sibling.name}</span>
                            {sibling.birthYear && (
                              <span className="text-xs text-gray-500 ml-2">
                                ({language === 'fr' ? 'né(e) en' : 'b.'} {sibling.birthYear})
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* AI Persona Chat */}
              <PersonaChat personaData={person} />
            </div>
            
            {/* Right column - Tabs with details */}
            <div className="col-span-1 lg:col-span-2">
              <Tabs defaultValue="biography" className="border border-gray-200 bg-white rounded-md">
                <TabsList className="bg-gray-100 w-full grid grid-cols-4 h-auto p-1">
                  <TabsTrigger value="biography" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black">{t('biography')}</TabsTrigger>
                  <TabsTrigger value="timeline" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black">{t('timeline')}</TabsTrigger>
                  <TabsTrigger value="gallery" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black">{t('gallery')}</TabsTrigger>
                  <TabsTrigger value="documents" className="py-2 data-[state=active]:bg-white data-[state=active]:text-black">{t('documents')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="biography" className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Brain className="h-5 w-5 text-gray-600 mr-2" />
                      <h3 className="text-xl">{t('biography')}</h3>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed">{biography}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <Card className="bg-gray-50 border border-gray-200">
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-sm font-medium text-gray-500">{t('birth_info')}</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2 px-4">
                          <div className="text-sm space-y-2">
                            <div className="flex">
                              <span className="text-gray-700 mr-2">{t('date')}:</span>
                              <span>{person.birthDate}</span>
                            </div>
                            <div className="flex">
                              <span className="text-gray-700 mr-2">{t('place')}:</span>
                              <span>{person.birthPlace}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {person.deathDate && (
                        <Card className="bg-gray-50 border border-gray-200">
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm font-medium text-gray-500">{t('death_info')}</CardTitle>
                          </CardHeader>
                          <CardContent className="py-2 px-4">
                            <div className="text-sm space-y-2">
                              <div className="flex">
                                <span className="text-gray-700 mr-2">{t('date')}:</span>
                                <span>{person.deathDate}</span>
                              </div>
                              <div className="flex">
                                <span className="text-gray-700 mr-2">{t('place')}:</span>
                                <span>{person.deathPlace}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="timeline" className="p-6">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                    <h3 className="text-xl">{t('timeline')}</h3>
                  </div>
                  
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute top-0 bottom-0 left-[18px] w-[2px] bg-gray-300 z-0"></div>
                    
                    {/* Timeline events */}
                    <div className="space-y-6 relative z-10">
                      {person.timeline.map((item, index) => {
                        // Calculate age at the time of the event
                        const birthYearNum = parseInt(birthYear);
                        const eventYearNum = parseInt(item.year);
                        const ageAtEvent = !isNaN(birthYearNum) && !isNaN(eventYearNum) 
                          ? eventYearNum - birthYearNum 
                          : null;
                        
                        return (
                          <div key={index} className="flex">
                            <div className="flex-shrink-0 mr-4">
                              <div className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center">
                                <TimelineIcon icon={item.icon} />
                              </div>
                            </div>
                            <div className="border border-gray-200 bg-white py-3 px-4 flex-grow rounded-md">
                              <div className="font-semibold text-black flex justify-between">
                                <span>{item.year}</span>
                                {ageAtEvent !== null && (
                                  <span className="text-gray-500 text-sm">
                                    {language === 'fr' ? `${ageAtEvent} ans` : `Age: ${ageAtEvent}`}
                                  </span>
                                )}
                              </div>
                              <div className="text-gray-700">{item.event}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <HistoricalEvents 
                    birthYear={birthYear}
                    deathYear={deathYear} 
                    country={person.country || 'France'}
                  />
                </TabsContent>
                
                <TabsContent value="gallery" className="p-6">
                  <div className="flex items-center mb-4">
                    <Image className="h-5 w-5 text-gray-600 mr-2" />
                    <h3 className="text-xl">{t('gallery')}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {person.images.map((image, index) => (
                      <div 
                        key={index} 
                        className="border border-gray-200 overflow-hidden group cursor-pointer rounded-md"
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <div className="relative">
                          <img 
                            src={image} 
                            alt={`${person.name} - Photo ${index + 1}`}
                            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="text-white">{t('view')}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="border border-dashed border-gray-300 flex items-center justify-center h-40 cursor-pointer hover:border-gray-400 transition-colors rounded-md">
                      <div className="text-center">
                        <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-gray-500">{language === 'fr' ? 'Ajouter une photo' : 'Add Photo'}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="documents" className="p-6">
                  <FileDropZone onAddToBio={handleAddToBio} />
                  
                  <div className="space-y-4 mt-6">
                    <div className="flex items-center mb-2">
                      <FileText className="h-5 w-5 text-gray-600 mr-2" />
                      <h3 className="text-xl">{t('documents')}</h3>
                    </div>
                    
                    {person.documents.map((doc, index) => (
                      <div key={index} className="border border-gray-200 bg-white p-4 flex items-center rounded-md">
                        <div className="mr-4 p-2 bg-gray-100 rounded-md">
                          <FileText className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-sm text-gray-500">
                            {doc.type} • {doc.date}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="border border-gray-300 hover:bg-gray-100 text-black">
                          {t('view')}
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Persona;
