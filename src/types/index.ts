export interface Location {
  city: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Education {
  institution: string;
  degree: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'certificate' | 'letter' | 'photo' | 'other';
  date: Date;
  fileUrl: string;
  ocrResults?: {
    fullText: string;
    summary: string;
    keyInfo: string[];
  };
  metadata?: {
    author?: string;
    receiver?: string;
    location?: Location;
    tags?: string[];
  };
}

export interface Image {
  id: string;
  url: string;
  caption?: string;
  date?: Date;
  location?: Location;
  tags?: string[];
}

export interface TimelineEvent {
  id: string;
  year: string;
  event: string;
  icon: string;
  description?: string;
  location?: Location;
  documents?: string[]; // Document IDs
}

export interface Relation {
  id: string;
  name: string;
  birthYear?: string;
  deathYear?: string;
  relationType: 'parent' | 'child' | 'spouse' | 'sibling';
}

export interface Person {
  id: string;
  name: string;
  birthDate: Date;
  deathDate?: Date;
  birthPlace?: Location;
  deathPlace?: Location;
  occupation?: string;
  education?: Education[];
  biography?: string;
  documents: Document[];
  images: Image[];
  relations: Relation[];
  timeline: TimelineEvent[];
  keyFacts: string[];
  changelog?: {
    id: string;
    date: Date;
    changes: string[];
    author: string;
  }[];
  metadata?: {
    tags?: string[];
    notes?: string;
    privacy?: 'public' | 'private' | 'family';
  };
}

export interface FamilyTree {
  id: string;
  name: string;
  rootPersonId: string;
  members: Person[];
  metadata?: {
    description?: string;
    createdBy: string;
    createdAt: Date;
    lastModified: Date;
  };
}

export interface GedcomData {
  individuals: {
    id: string;
    name: string;
    birth?: {
      date?: string;
      place?: string;
    };
    death?: {
      date?: string;
      place?: string;
    };
    parents?: string[];
    children?: string[];
    spouses?: string[];
  }[];
  families: {
    id: string;
    husband?: string;
    wife?: string;
    children?: string[];
    marriage?: {
      date?: string;
      place?: string;
    };
  }[];
}

export interface Family {
  id: string;
  name: string;
  description?: string;
  members: Person[];
  createdAt: string;
  updatedAt: string;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  deathPlace?: string;
  gender: 'male' | 'female' | 'other';
  bio?: string;
  photo?: string;
  documents: Document[];
  timeline: TimelineEvent[];
  keyFacts: KeyFact[];
  metadata: {
    tags?: string[];
    notes?: string;
    privacy?: 'public' | 'private' | 'family';
  };
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  type: 'birth_certificate' | 'death_certificate' | 'marriage_certificate' | 'photo' | 'other';
  url: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  category: 'birth' | 'death' | 'marriage' | 'education' | 'career' | 'other';
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KeyFact {
  id: string;
  title: string;
  description: string;
  category: 'personal' | 'family' | 'historical' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface ChangelogEntry {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    changes: boolean;
    updates: boolean;
  };
  privacy: {
    showBirthDate: boolean;
    showDeathDate: boolean;
    showLocation: boolean;
    showDocuments: boolean;
  };
  display: {
    dateFormat: string;
    timeFormat: string;
    showAge: boolean;
    showPhotos: boolean;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  id: string;
  type: 'person' | 'family' | 'document' | 'event';
  title: string;
  description: string;
  relevance: number;
  metadata: Record<string, any>;
}

export * from './auth';
export * from './family';
export * from './common'; 