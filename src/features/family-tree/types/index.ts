export interface Person {
  id: string;
  name: string;
  treeId: string;
  birthDate?: string;
  deathDate?: string;
  gender?: string;
  occupation?: string;
  birthPlace?: string;
  deathPlace?: string;
  notes?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Relationship {
  id: string;
  person1Id: string;
  person2Id: string;
  type: 'parent' | 'spouse' | 'sibling';
  treeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyTree {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyContextType {
  persons: Person[];
  relationships: Relationship[];
  trees: FamilyTree[];
  loading: boolean;
  error: string | null;
  currentTree: FamilyTree | null;
  fetchPersons: () => Promise<void>;
  fetchRelationships: () => Promise<void>;
  fetchTrees: () => Promise<void>;
  addPerson: (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePerson: (id: string, person: Partial<Person>) => Promise<void>;
  deletePerson: (id: string) => Promise<void>;
  addRelationship: (relationship: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRelationship: (id: string, relationship: Partial<Relationship>) => Promise<void>;
  deleteRelationship: (id: string) => Promise<void>;
  addTree: (tree: Omit<FamilyTree, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTree: (id: string, tree: Partial<FamilyTree>) => Promise<void>;
  deleteTree: (id: string) => Promise<void>;
  setCurrentTree: (tree: FamilyTree | null) => void;
} 