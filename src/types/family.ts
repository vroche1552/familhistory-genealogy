export interface Location {
  city: string;
  state?: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface KeyFact {
  type: 'birth' | 'death' | 'marriage' | 'occupation' | 'education' | 'military' | 'other';
  date?: Date;
  location?: Location;
  description: string;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  birthDate?: Date;
  deathDate?: Date;
  birthPlace?: Location;
  deathPlace?: Location;
  gender?: 'male' | 'female' | 'other';
  occupation?: string;
  education?: string;
  keyFacts: KeyFact[];
  photos: Photo[];
  documents: Document[];
  metadata: Record<string, any>;
}

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  date?: Date;
  location?: Location;
  type: 'photo' | 'other';
  metadata: Record<string, any>;
}

export interface Document {
  id: string;
  url: string;
  title: string;
  date?: Date;
  type: 'birth_certificate' | 'death_certificate' | 'marriage_certificate' | 'photo' | 'other';
  metadata: Record<string, any>;
}

export interface Relationship {
  id: string;
  personId: string;
  relatedPersonId: string;
  type: 'parent' | 'child' | 'spouse' | 'sibling' | 'other';
  startDate?: Date;
  endDate?: Date;
  metadata: Record<string, any>;
}

export interface FamilyTree {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: Person[];
  relationships: Relationship[];
  metadata: Record<string, any>;
}

export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  deathDate?: string;
  gender?: 'male' | 'female' | 'other';
  parentIds: string[];
  spouseIds: string[];
  occupation?: string;
  birthPlace?: string;
  deathPlace?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyContextType {
  familyMembers: FamilyMember[];
  loading: boolean;
  error: string | null;
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateFamilyMember: (id: string, member: Partial<FamilyMember>) => Promise<void>;
  deleteFamilyMember: (id: string) => Promise<void>;
  getFamilyMember: (id: string) => FamilyMember | undefined;
  getFamilyMembers: () => FamilyMember[];
} 