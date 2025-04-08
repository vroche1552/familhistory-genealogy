// Base event interface for timeline events
export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'birth' | 'death' | 'marriage';
  location?: string;
}

// GEDCOM-specific interfaces
export interface GedcomEvent {
  date?: string;
  place?: string;
}

export interface GedcomIndividual {
  id: string;
  name: string;
  sex: 'M' | 'F' | 'U';
  birth?: GedcomEvent;
  death?: GedcomEvent;
  parents: string[];
  children: string[];
  spouses: string[];
}

export interface GedcomFamily {
  id: string;
  husband?: string;
  wife?: string;
  children: string[];
  marriage?: GedcomEvent;
}

export interface GedcomData {
  individuals: GedcomIndividual[];
  families: GedcomFamily[];
}

// Application-specific interfaces
export interface Person {
  id: string;
  first_name: string;
  last_name: string;
  birth_date?: string;
  death_date?: string;
  gender: 'male' | 'female' | 'other';
  biography?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  family_tree_id: string | null;
  birth_event?: TimelineEvent;
  death_event?: TimelineEvent;
}

export interface Relationship {
  id: string;
  person1_id: string;
  person2_id: string;
  relationship_type: 'parent' | 'child' | 'spouse' | 'sibling';
  start_date?: string;
  end_date?: string | null;
  notes: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  family_tree_id: string | null;
}

export interface FamilyTree {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  people: Person[];
  relationships: Relationship[];
} 