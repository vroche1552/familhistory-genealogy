import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PersonForm } from '@/components/forms/PersonForm';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Person {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  gender: string;
}

export default function FamilyMembers() {
  const { treeId } = useParams<{ treeId: string }>();
  const [persons, setPersons] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadPersons = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('persons')
        .select('*')
        .eq('family_tree_id', treeId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPersons(data || []);
    } catch (error) {
      console.error('Error loading persons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (treeId) {
      loadPersons();
    }
  }, [treeId]);

  if (!treeId) return <div>No family tree selected</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Family Members</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Family Member'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Family Member</CardTitle>
            <CardDescription>
              Enter the details of the new family member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PersonForm
              familyTreeId={treeId}
              onSuccess={() => {
                loadPersons();
                setShowForm(false);
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {persons.map((person) => (
          <Card key={person.id}>
            <CardHeader>
              <CardTitle>{`${person.first_name} ${person.last_name}`}</CardTitle>
              <CardDescription>
                {person.birth_date
                  ? `Born: ${new Date(person.birth_date).toLocaleDateString()}`
                  : 'Birth date not available'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Gender: {person.gender}</p>
              {/* Add more details and actions here */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 