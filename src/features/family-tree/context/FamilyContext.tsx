import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { useAuth } from '@/features/auth';

interface Person {
  id: string;
  name: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  deathPlace?: string;
  gender: 'male' | 'female' | 'other';
  photo?: string;
  bio?: string;
  treeId: string;
  createdAt: string;
  updatedAt: string;
  position?: {
    x: number;
    y: number;
  };
}

interface Relationship {
  id: string;
  person1Id: string;
  person2Id: string;
  type: 'parent' | 'child' | 'spouse' | 'sibling';
  treeId: string;
  createdAt: string;
  updatedAt: string;
}

interface FamilyTree {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface FamilyContextType {
  currentTree: FamilyTree | null;
  setCurrentTree: (tree: FamilyTree | null) => void;
  persons: Person[];
  relationships: Relationship[];
  trees: FamilyTree[];
  loading: boolean;
  error: string | null;
  addPerson: (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePerson: (id: string, updates: Partial<Person>) => Promise<void>;
  deletePerson: (id: string) => Promise<void>;
  addRelationship: (relationship: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRelationship: (id: string, updates: Partial<Relationship>) => Promise<void>;
  deleteRelationship: (id: string) => Promise<void>;
  createTree: (tree: Omit<FamilyTree, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTree: (id: string, updates: Partial<FamilyTree>) => Promise<void>;
  deleteTree: (id: string) => Promise<void>;
  hasRelationships: (personId: string) => boolean;
}

export type { Person, Relationship, FamilyTree, FamilyContextType };

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);
export { FamilyContext };

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentTree, setCurrentTree] = useState<FamilyTree | null>(null);
  const [persons, setPersons] = useState<Person[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [trees, setTrees] = useState<FamilyTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchTrees();
    }
  }, [user]);

  useEffect(() => {
    if (currentTree) {
      fetchTreeData(currentTree.id);
    }
  }, [currentTree]);

  const fetchTrees = async () => {
    try {
      const { data, error } = await supabase
        .from('family_trees')
        .select('*')
        .eq('ownerId', user?.id)
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setTrees(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trees');
    }
  };

  const fetchTreeData = async (treeId: string) => {
    try {
      setLoading(true);
      const [personsResult, relationshipsResult] = await Promise.all([
        supabase.from('persons').select('*').eq('treeId', treeId),
        supabase.from('relationships').select('*').eq('treeId', treeId),
      ]);

      if (personsResult.error) throw personsResult.error;
      if (relationshipsResult.error) throw relationshipsResult.error;

      setPersons(personsResult.data || []);
      setRelationships(relationshipsResult.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tree data');
    } finally {
      setLoading(false);
    }
  };

  const addPerson = async (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('persons')
        .insert([person])
        .select()
        .single();

      if (error) throw error;
      setPersons(prev => [...prev, data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add person');
      throw err;
    }
  };

  const updatePerson = async (id: string, updates: Partial<Person>) => {
    try {
      const { data, error } = await supabase
        .from('persons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setPersons(prev => prev.map(p => (p.id === id ? data : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update person');
      throw err;
    }
  };

  const deletePerson = async (id: string) => {
    try {
      const { error } = await supabase.from('persons').delete().eq('id', id);
      if (error) throw error;
      setPersons(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete person');
      throw err;
    }
  };

  const addRelationship = async (relationship: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('relationships')
        .insert([relationship])
        .select()
        .single();

      if (error) throw error;
      setRelationships(prev => [...prev, data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add relationship');
      throw err;
    }
  };

  const updateRelationship = async (id: string, updates: Partial<Relationship>) => {
    try {
      const { data, error } = await supabase
        .from('relationships')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setRelationships(prev => prev.map(r => (r.id === id ? data : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update relationship');
      throw err;
    }
  };

  const deleteRelationship = async (id: string) => {
    try {
      const { error } = await supabase.from('relationships').delete().eq('id', id);
      if (error) throw error;
      setRelationships(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete relationship');
      throw err;
    }
  };

  const createTree = async (tree: Omit<FamilyTree, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('family_trees')
        .insert([tree])
        .select()
        .single();

      if (error) throw error;
      setTrees(prev => [...prev, data]);
      setCurrentTree(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tree');
      throw err;
    }
  };

  const updateTree = async (id: string, updates: Partial<FamilyTree>) => {
    try {
      const { data, error } = await supabase
        .from('family_trees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTrees(prev => prev.map(t => (t.id === id ? data : t)));
      if (currentTree?.id === id) {
        setCurrentTree(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tree');
      throw err;
    }
  };

  const deleteTree = async (id: string) => {
    try {
      const { error } = await supabase.from('family_trees').delete().eq('id', id);
      if (error) throw error;
      setTrees(prev => prev.filter(t => t.id !== id));
      if (currentTree?.id === id) {
        setCurrentTree(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tree');
      throw err;
    }
  };

  const hasRelationships = (personId: string) => {
    return relationships.some(rel => rel.person1Id === personId || rel.person2Id === personId);
  };

  const value = {
    currentTree,
    setCurrentTree,
    persons,
    relationships,
    trees,
    loading,
    error,
    addPerson,
    updatePerson,
    deletePerson,
    addRelationship,
    updateRelationship,
    deleteRelationship,
    createTree,
    updateTree,
    deleteTree,
    hasRelationships
  };

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
}

export function useFamily() {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
} 