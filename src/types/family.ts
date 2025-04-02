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