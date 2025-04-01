import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFamily } from '@/contexts/FamilyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Book,
  FileText,
  Clock,
  Star
} from 'lucide-react';

export const PersonProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { family } = useFamily();

  // Find the person in any family
  const person = family.flatMap(f => f.members).find(p => p.id === id);

  if (!person) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">{t('person.not_found')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const parents = person.relations
    .filter(r => r.relationType === 'parent')
    .map(r => family.flatMap(f => f.members).find(m => m.id === r.id))
    .filter(Boolean);

  const children = person.relations
    .filter(r => r.relationType === 'child')
    .map(r => family.flatMap(f => f.members).find(m => m.id === r.id))
    .filter(Boolean);

  const spouse = person.relations
    .find(r => r.relationType === 'spouse');

  const spousePerson = spouse
    ? family.flatMap(f => f.members).find(m => m.id === spouse.id)
    : null;

  return (
    <div className="container mx-auto p-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('common.back')}
      </Button>

      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold">
                  {person.firstName} {person.lastName}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(person.birthDate), 'MMMM d, yyyy')}</span>
                  {person.birthPlace && (
                    <>
                      <MapPin className="h-4 w-4 ml-2" />
                      <span>{person.birthPlace.city}, {person.birthPlace.country}</span>
                    </>
                  )}
                </div>
              </div>
              <Badge>{t(`common.${person.gender}`)}</Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info">{t('person.personal_info')}</TabsTrigger>
            <TabsTrigger value="documents">{t('person.documents')}</TabsTrigger>
            <TabsTrigger value="timeline">{t('person.timeline')}</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Biography */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('person.biography')}</h3>
                    {person.bio ? (
                      <p className="text-muted-foreground">{person.bio}</p>
                    ) : (
                      <p className="text-muted-foreground">{t('person.no_bio')}</p>
                    )}
                  </div>

                  {/* Key Facts */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('person.key_facts')}</h3>
                    {person.keyFacts && person.keyFacts.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {person.keyFacts.map((fact, index) => (
                          <li key={index}>{fact}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">{t('person.no_facts')}</p>
                    )}
                  </div>

                  {/* Family Relationships */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('person.family_relationships')}</h3>
                    <div className="space-y-4">
                      {/* Parents */}
                      <div>
                        <h4 className="font-medium mb-1">{t('person.parents')}</h4>
                        {parents.length > 0 ? (
                          <ul className="space-y-1">
                            {parents.map(parent => (
                              <li key={parent.id}>
                                <Button
                                  variant="link"
                                  className="h-auto p-0"
                                  onClick={() => navigate(`/person/${parent.id}`)}
                                >
                                  {parent.firstName} {parent.lastName}
                                </Button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground">{t('person.no_parents')}</p>
                        )}
                      </div>

                      {/* Spouse */}
                      <div>
                        <h4 className="font-medium mb-1">{t('person.spouse')}</h4>
                        {spousePerson ? (
                          <Button
                            variant="link"
                            className="h-auto p-0"
                            onClick={() => navigate(`/person/${spousePerson.id}`)}
                          >
                            {spousePerson.firstName} {spousePerson.lastName}
                          </Button>
                        ) : (
                          <p className="text-muted-foreground">{t('person.no_spouse')}</p>
                        )}
                      </div>

                      {/* Children */}
                      <div>
                        <h4 className="font-medium mb-1">{t('person.children')}</h4>
                        {children.length > 0 ? (
                          <ul className="space-y-1">
                            {children.map(child => (
                              <li key={child.id}>
                                <Button
                                  variant="link"
                                  className="h-auto p-0"
                                  onClick={() => navigate(`/person/${child.id}`)}
                                >
                                  {child.firstName} {child.lastName}
                                </Button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground">{t('person.no_children')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardContent className="p-6">
                {person.documents && person.documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {person.documents.map(doc => (
                      <Card key={doc.id}>
                        <CardContent className="p-4">
                          <FileText className="h-8 w-8 mb-2 text-muted-foreground" />
                          <h4 className="font-medium">{doc.title}</h4>
                          <p className="text-sm text-muted-foreground">{doc.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">{t('person.no_documents')}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardContent className="p-6">
                {person.timeline && person.timeline.length > 0 ? (
                  <div className="space-y-4">
                    {person.timeline.map(event => (
                      <div key={event.id} className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
                            {event.location && (
                              <>
                                <MapPin className="h-3 w-3 ml-2" />
                                <span>{typeof event.location === 'string' ? event.location : `${event.location.city}, ${event.location.country}`}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">{t('person.no_timeline')}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PersonProfile; 