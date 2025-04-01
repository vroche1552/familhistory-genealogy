import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGetFamilyTreeQuery } from '@/lib/api';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Heart, 
  GraduationCap,
  Brain,
  Star
} from 'lucide-react';
import type { Person } from '@/types';

const Family = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { data: familyTree, isLoading, error } = useGetFamilyTreeQuery(id || '');
  const [personOfTheDay, setPersonOfTheDay] = useState<Person | null>(null);

  useEffect(() => {
    if (familyTree?.members) {
      // Get today's date as a seed for consistent person selection
      const today = new Date();
      const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
      
      // Use the seed to select a person
      const index = seed % familyTree.members.length;
      setPersonOfTheDay(familyTree.members[index]);
    }
  }, [familyTree]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !familyTree) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{t('family.family_not_found')}</p>
      </div>
    );
  }

  // Calculate statistics
  const stats = {
    totalPersons: familyTree.members.length,
    totalMarriages: familyTree.members.filter(p => p.relations.some(r => r.relationType === 'spouse')).length,
    totalChildren: familyTree.members.filter(p => p.relations.some(r => r.relationType === 'child')).length,
    averageAge: familyTree.members.reduce((acc, p) => {
      const birthYear = new Date(p.birthDate).getFullYear();
      const deathYear = p.deathDate ? new Date(p.deathDate).getFullYear() : new Date().getFullYear();
      return acc + (deathYear - birthYear);
    }, 0) / familyTree.members.length,
    oldestPerson: familyTree.members.reduce((oldest, current) => {
      const oldestBirth = new Date(oldest.birthDate);
      const currentBirth = new Date(current.birthDate);
      return currentBirth < oldestBirth ? current : oldest;
    }),
    youngestPerson: familyTree.members.reduce((youngest, current) => {
      const youngestBirth = new Date(youngest.birthDate);
      const currentBirth = new Date(current.birthDate);
      return currentBirth > youngestBirth ? current : youngest;
    }),
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">{familyTree.name}</h1>

      {/* Person of the Day */}
      {personOfTheDay && (
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-primary" />
              {t('family.person_of_the_day')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xl font-semibold">{personOfTheDay.name}</h3>
                <div className="text-muted-foreground">
                  {formatDate(personOfTheDay.birthDate)}
                </div>
                {personOfTheDay.birthPlace && (
                  <div className="text-muted-foreground">
                    {personOfTheDay.birthPlace.city}, {personOfTheDay.birthPlace.country}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{personOfTheDay.biography}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              {t('family.total_persons')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalPersons}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              {t('family.total_marriages')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalMarriages}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              {t('family.total_children')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalChildren}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              {t('family.average_age')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Math.round(stats.averageAge)}</p>
            <p className="text-sm text-muted-foreground">{t('family.years')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              {t('family.oldest_person')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{stats.oldestPerson.name}</p>
            <div className="text-sm text-muted-foreground">
              {formatDate(stats.oldestPerson.birthDate)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              {t('family.youngest_person')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{stats.youngestPerson.name}</p>
            <div className="text-sm text-muted-foreground">
              {formatDate(stats.youngestPerson.birthDate)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Family; 