import React, { createContext, useContext, useState, useCallback } from 'react';
import { Person, Family } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from './LanguageContext';

interface FamilyContextType {
  family: Family[];
  addFamily: (family: Family) => void;
  updateFamily: (id: string, family: Partial<Family>) => void;
  deleteFamily: (id: string) => void;
  addPerson: (familyId: string, person: Person) => void;
  updatePerson: (familyId: string, person: Person) => void;
  deletePerson: (familyId: string, personId: string) => void;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [families, setFamilies] = useState<Family[]>([]);
  const { toast } = useToast();
  const { t } = useLanguage();

  const addFamily = useCallback((family: Family) => {
    setFamilies(prev => [...prev, family]);
    toast({
      title: t('family.added'),
      description: t('family.added_description'),
    });
  }, [toast, t]);

  const updateFamily = useCallback((id: string, updates: Partial<Family>) => {
    setFamilies(prev => prev.map(family => 
      family.id === id ? { ...family, ...updates } : family
    ));
    toast({
      title: t('family.updated'),
      description: t('family.updated_description'),
    });
  }, [toast, t]);

  const deleteFamily = useCallback((id: string) => {
    setFamilies(prev => prev.filter(family => family.id !== id));
    toast({
      title: t('family.deleted'),
      description: t('family.deleted_description'),
      variant: 'destructive',
    });
  }, [toast, t]);

  const addPerson = useCallback((familyId: string, person: Person) => {
    setFamilies(prev => prev.map(family => {
      if (family.id === familyId) {
        return {
          ...family,
          members: [...family.members, person],
        };
      }
      return family;
    }));
    toast({
      title: t('person.added'),
      description: t('person.added_description'),
    });
  }, [toast, t]);

  const updatePerson = useCallback((familyId: string, updatedPerson: Person) => {
    setFamilies(prev => prev.map(family => {
      if (family.id === familyId) {
        return {
          ...family,
          members: family.members.map(person =>
            person.id === updatedPerson.id ? updatedPerson : person
          ),
        };
      }
      return family;
    }));
    toast({
      title: t('person.updated'),
      description: t('person.updated_description'),
    });
  }, [toast, t]);

  const deletePerson = useCallback((familyId: string, personId: string) => {
    setFamilies(prev => prev.map(family => {
      if (family.id === familyId) {
        return {
          ...family,
          members: family.members.filter(person => person.id !== personId),
        };
      }
      return family;
    }));
    toast({
      title: t('person.deleted'),
      description: t('person.deleted_description'),
      variant: 'destructive',
    });
  }, [toast, t]);

  return (
    <FamilyContext.Provider
      value={{
        family: families,
        addFamily,
        updateFamily,
        deleteFamily,
        addPerson,
        updatePerson,
        deletePerson,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
}; 