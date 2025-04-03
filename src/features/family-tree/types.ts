export interface Person {
  id: string;
  name: string;
  bio?: string;
  occupation?: string;
  birthDate?: string;
  deathDate?: string;
  gender?: 'male' | 'female' | 'other';
} 