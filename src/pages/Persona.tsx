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
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import HistoricalEvents from '@/components/persona/HistoricalEvents';
import FileDropZone from '@/components/persona/FileDropZone';
import KeyFacts from '@/components/persona/KeyFacts';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useGetPersonQuery } from '@/lib/api';
import AiTextInput from '@/components/persona/AiTextInput';
import Changelog from '@/components/persona/Changelog';

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
      return <User className="h-4 w-4" />;
  }
};

const Persona = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { data: person, isLoading, error } = useGetPersonQuery(id || '');
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddToBio = (text: string) => {
    // TODO: Implement bio update logic
    toast({
      title: t('common.information_processed'),
      description: t('common.information_processed_description'),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{t('common.person_not_found')}</p>
      </div>
    );
  }

  const birthYear = person.birthDate ? new Date(person.birthDate).getFullYear().toString() : undefined;
  const deathYear = person.deathDate ? new Date(person.deathDate).getFullYear().toString() : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{person.name}</h1>
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            {t('common.edit')}
          </Button>
        </div>

        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>{t('common.ai_input')}</CardTitle>
            </CardHeader>
            <CardContent>
              <AiTextInput onUpdate={(updates) => {
                // TODO: Implement update logic
                toast({
                  title: t('common.information_processed'),
                  description: t('common.information_processed_description'),
                });
              }} />
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="info" className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">{t('common.information')}</TabsTrigger>
            <TabsTrigger value="timeline">{t('common.timeline')}</TabsTrigger>
            <TabsTrigger value="documents">{t('common.documents')}</TabsTrigger>
            <TabsTrigger value="changelog">{t('common.changelog')}</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  {t('common.basic_info')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{t('common.birth_date')}</p>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(person.birthDate)}
                    </div>
                  </div>
                  {person.birthPlace && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{t('common.birth_place')}</p>
                      <div className="text-sm text-muted-foreground">
                        {person.birthPlace.city}, {person.birthPlace.country}
                      </div>
                    </div>
                  )}
                  {person.deathDate && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{t('common.death_date')}</p>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(person.deathDate)}
                      </div>
                    </div>
                  )}
                  {person.deathPlace && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{t('common.death_place')}</p>
                      <div className="text-sm text-muted-foreground">
                        {person.deathPlace.city}, {person.deathPlace.country}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  {t('common.occupation')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{person.occupation}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  {t('common.education')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {person.education?.map((edu, index) => (
                    <div key={index} className="space-y-1">
                      <p className="font-medium">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground">{edu.degree}</p>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : t('common.present')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  {t('common.biography')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{person.biography}</p>
              </CardContent>
            </Card>

            <KeyFacts facts={person.keyFacts} personName={person.name} />
          </TabsContent>

          <TabsContent value="timeline">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <HistoricalEvents
                  birthYear={person.birthDate ? new Date(person.birthDate).getFullYear() : undefined}
                  deathYear={person.deathDate ? new Date(person.deathDate).getFullYear() : undefined}
                  country={person.birthPlace?.country}
                />
              </div>
              <div className="col-span-2">
                <Changelog changes={person.changelog} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <FileDropZone personId={person.id} onAddToBio={handleAddToBio} />
          </TabsContent>

          <TabsContent value="changelog">
            <Card>
              <CardHeader>
                <CardTitle>{t('common.changelog')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t('common.coming_soon')}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Persona;
