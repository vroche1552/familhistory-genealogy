import { useState, useEffect } from 'react';
import { Person } from '../types';

interface Relationship {
  fromId: string;
  toId: string;
  type: 'parent' | 'spouse' | 'sibling';
}

export const useFamily = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API calls
        const mockPersons: Person[] = [
          {
            id: '1',
            name: 'John Doe',
            birthDate: '1950-01-01',
            occupation: 'Engineer'
          },
          {
            id: '2',
            name: 'Jane Doe',
            birthDate: '1952-02-02',
            occupation: 'Teacher'
          }
        ];

        const mockRelationships: Relationship[] = [
          {
            fromId: '1',
            toId: '2',
            type: 'spouse'
          }
        ];

        setPersons(mockPersons);
        setRelationships(mockRelationships);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    persons,
    relationships,
    loading,
    error
  };
}; 