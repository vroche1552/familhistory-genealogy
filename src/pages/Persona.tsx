
import { useState } from 'react';
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
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import HistoricalEvents from '@/components/persona/HistoricalEvents';
import FileDropZone from '@/components/persona/FileDropZone';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

// Mock data for demo purposes
const personData = {
  id: '1',
  name: 'John Doe',
  birthDate: 'April 12, 1950',
  birthPlace: 'Boston, Massachusetts',
  country: 'United States',
  deathDate: '',
  deathPlace: '',
  occupation: 'Architect',
  education: 'Harvard University',
  biography: 'John Doe was born in Boston to James and Mary Doe. He studied architecture at Harvard University and went on to design several notable buildings in the New England area. He married Jane Smith in 1975 and they had two children together.',
  images: [
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=600&auto=format',
    'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=600&auto=format'
  ],
  documents: [
    { name: 'Birth Certificate', type: 'certificate', date: '1950' },
    { name: 'Marriage License', type: 'certificate', date: '1975' },
    { name: 'Architecture License', type: 'license', date: '1978' }
  ],
  timeline: [
    { year: '1950', event: 'Born in Boston, Massachusetts', icon: 'User' },
    { year: '1968', event: 'Graduated from Boston High School', icon: 'GraduationCap' },
    { year: '1972', event: 'Graduated from Harvard University with a degree in Architecture', icon: 'GraduationCap' },
    { year: '1975', event: 'Married Jane Smith', icon: 'Heart' },
    { year: '1977', event: 'First child born - Michael Doe', icon: 'User' },
    { year: '1980', event: 'Second child born - Sarah Doe', icon: 'User' },
    { year: '1985', event: 'Established Doe Architecture Firm', icon: 'Briefcase' }
  ],
  relations: {
    parents: [
      { id: '5', name: 'James Doe', birthYear: '1920', deathYear: '1990' },
      { id: '6', name: 'Mary Doe', birthYear: '1925', deathYear: '1995' }
    ],
    partners: [
      { id: '2', name: 'Jane Doe (Smith)', birthYear: '1953' }
    ],
    children: [
      { id: '3', name: 'Michael Doe', birthYear: '1977' },
      { id: '4', name: 'Sarah Doe', birthYear: '1980' }
    ],
    siblings: [
      { id: '7', name: 'Robert Doe', birthYear: '1952' }
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
  
  return (
    <div className="min-h-screen bg-cyber-background text-cyber-foreground flex flex-col intelligence-pattern">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Header with actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold cyber-text-gradient">{person.name}</h1>
              <div className="flex items-center text-muted-foreground mt-1">
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
                <Button variant="outline" className="cyber-button">
                  <Trees className="h-4 w-4 mr-2" /> {t('view_in_tree')}
                </Button>
              </Link>
              <Button className="bg-cyber-accent hover:bg-cyber-accent/80 text-black">
                <Edit className="h-4 w-4 mr-2" /> {t('edit')} {language === 'fr' ? 'Profil' : 'Profile'}
              </Button>
            </div>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Images and info */}
            <div className="col-span-1">
              <Card className="cyber-card overflow-hidden mb-6">
                <div className="relative">
                  <img 
                    src={person.images[activeImageIndex]} 
                    alt={person.name} 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-center gap-2 bg-gradient-to-t from-cyber-dark/90 to-transparent">
                    {person.images.map((img, index) => (
                      <button 
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${index === activeImageIndex ? 'bg-cyber-accent' : 'bg-cyber-foreground/30'}`}
                      />
                    ))}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {person.occupation && (
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 text-cyber-accent mr-2" />
                        <span>{t('occupation')}: {person.occupation}</span>
                      </div>
                    )}
                    
                    {person.education && (
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 text-cyber-accent mr-2" />
                        <span>{t('education')}: {person.education}</span>
                      </div>
                    )}
                    
                    {person.country && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-cyber-accent mr-2" />
                        <span>{language === 'fr' ? 'Pays' : 'Country'}: {person.country}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Family relationships */}
              <Card className="cyber-card mb-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-4 w-4 text-cyber-accent mr-2" /> {language === 'fr' ? 'Relations Familiales' : 'Family Relationships'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Parents */}
                  {person.relations.parents.length > 0 && (
                    <div>
                      <h4 className="text-sm text-muted-foreground mb-2">{t('parents')}</h4>
                      <div className="space-y-2">
                        {person.relations.parents.map(parent => (
                          <Link 
                            key={parent.id} 
                            to={`/persona/${parent.id}`}
                            className="flex items-center py-1 px-2 rounded-md hover:bg-cyber-dark transition-colors"
                          >
                            <User className="h-4 w-4 text-cyber-accent mr-2" />
                            <span>{parent.name}</span>
                            {(parent.birthYear || parent.deathYear) && (
                              <span className="text-xs text-muted-foreground ml-2">
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
                      <h4 className="text-sm text-muted-foreground mb-2">{t('partners')}</h4>
                      <div className="space-y-2">
                        {person.relations.partners.map(partner => (
                          <Link 
                            key={partner.id} 
                            to={`/persona/${partner.id}`}
                            className="flex items-center py-1 px-2 rounded-md hover:bg-cyber-dark transition-colors"
                          >
                            <Heart className="h-4 w-4 text-cyber-accent mr-2" />
                            <span>{partner.name}</span>
                            {partner.birthYear && (
                              <span className="text-xs text-muted-foreground ml-2">
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
                      <h4 className="text-sm text-muted-foreground mb-2">{t('children')}</h4>
                      <div className="space-y-2">
                        {person.relations.children.map(child => (
                          <Link 
                            key={child.id} 
                            to={`/persona/${child.id}`}
                            className="flex items-center py-1 px-2 rounded-md hover:bg-cyber-dark transition-colors"
                          >
                            <User className="h-4 w-4 text-cyber-accent mr-2" />
                            <span>{child.name}</span>
                            {child.birthYear && (
                              <span className="text-xs text-muted-foreground ml-2">
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
                      <h4 className="text-sm text-muted-foreground mb-2">{t('siblings')}</h4>
                      <div className="space-y-2">
                        {person.relations.siblings.map(sibling => (
                          <Link 
                            key={sibling.id} 
                            to={`/persona/${sibling.id}`}
                            className="flex items-center py-1 px-2 rounded-md hover:bg-cyber-dark transition-colors"
                          >
                            <User className="h-4 w-4 text-cyber-accent mr-2" />
                            <span>{sibling.name}</span>
                            {sibling.birthYear && (
                              <span className="text-xs text-muted-foreground ml-2">
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
            </div>
            
            {/* Right column - Tabs with details */}
            <div className="col-span-1 lg:col-span-2">
              <Tabs defaultValue="biography" className="cyber-card">
                <TabsList className="bg-cyber-dark w-full grid grid-cols-4 h-auto p-1">
                  <TabsTrigger value="biography" className="py-2">{t('biography')}</TabsTrigger>
                  <TabsTrigger value="timeline" className="py-2">{t('timeline')}</TabsTrigger>
                  <TabsTrigger value="gallery" className="py-2">{t('gallery')}</TabsTrigger>
                  <TabsTrigger value="documents" className="py-2">{t('documents')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="biography" className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Brain className="h-5 w-5 text-cyber-accent mr-2" />
                      <h3 className="text-xl">{t('biography')}</h3>
                    </div>
                    
                    <p className="text-cyber-foreground leading-relaxed">{biography}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <Card className="cyber-card bg-cyber-dark/50">
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-sm font-medium text-muted-foreground">{t('birth_info')}</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2 px-4">
                          <div className="text-sm space-y-2">
                            <div className="flex">
                              <span className="text-cyber-accent mr-2">{t('date')}:</span>
                              <span>{person.birthDate}</span>
                            </div>
                            <div className="flex">
                              <span className="text-cyber-accent mr-2">{t('place')}:</span>
                              <span>{person.birthPlace}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {person.deathDate && (
                        <Card className="cyber-card bg-cyber-dark/50">
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{t('death_info')}</CardTitle>
                          </CardHeader>
                          <CardContent className="py-2 px-4">
                            <div className="text-sm space-y-2">
                              <div className="flex">
                                <span className="text-cyber-accent mr-2">{t('date')}:</span>
                                <span>{person.deathDate}</span>
                              </div>
                              <div className="flex">
                                <span className="text-cyber-accent mr-2">{t('place')}:</span>
                                <span>{person.deathPlace}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    
                    <HistoricalEvents 
                      birthYear={person.birthDate.split(',')[1]?.trim().substring(0, 4) || '1950'} 
                      deathYear={person.deathDate ? person.deathDate.split(',')[1]?.trim().substring(0, 4) : ''} 
                      country={person.country || 'United States'}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="timeline" className="p-6">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-cyber-accent mr-2" />
                    <h3 className="text-xl">{t('timeline')}</h3>
                  </div>
                  
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute top-0 bottom-0 left-[18px] w-[2px] bg-cyber-border z-0"></div>
                    
                    {/* Timeline events */}
                    <div className="space-y-6 relative z-10">
                      {person.timeline.map((item, index) => (
                        <div key={index} className="flex">
                          <div className="flex-shrink-0 mr-4">
                            <div className="w-10 h-10 rounded-full bg-cyber-dark border border-cyber-accent flex items-center justify-center">
                              <TimelineIcon icon={item.icon} />
                            </div>
                          </div>
                          <div className="cyber-card py-3 px-4 flex-grow">
                            <div className="font-semibold text-cyber-accent">{item.year}</div>
                            <div>{item.event}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="gallery" className="p-6">
                  <div className="flex items-center mb-4">
                    <Image className="h-5 w-5 text-cyber-accent mr-2" />
                    <h3 className="text-xl">{t('gallery')}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {person.images.map((image, index) => (
                      <div 
                        key={index} 
                        className="cyber-card overflow-hidden group cursor-pointer"
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <div className="relative">
                          <img 
                            src={image} 
                            alt={`${person.name} - Photo ${index + 1}`}
                            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-cyber-dark/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="text-cyber-accent">{t('view')}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="cyber-card border border-dashed border-cyber-border flex items-center justify-center h-40 cursor-pointer hover:border-cyber-accent/50 transition-colors">
                      <div className="text-center">
                        <Image className="h-8 w-8 text-cyber-accent/50 mx-auto mb-2" />
                        <span className="text-muted-foreground">{language === 'fr' ? 'Ajouter une photo' : 'Add Photo'}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="documents" className="p-6">
                  <FileDropZone onAddToBio={handleAddToBio} />
                  
                  <div className="space-y-4 mt-6">
                    <div className="flex items-center mb-2">
                      <FileText className="h-5 w-5 text-cyber-accent mr-2" />
                      <h3 className="text-xl">{t('documents')}</h3>
                    </div>
                    
                    {person.documents.map((doc, index) => (
                      <div key={index} className="cyber-card p-4 flex items-center">
                        <div className="mr-4 p-2 bg-cyber-dark rounded-md">
                          <FileText className="h-6 w-6 text-cyber-accent" />
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {doc.type} • {doc.date}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="cyber-button">
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
