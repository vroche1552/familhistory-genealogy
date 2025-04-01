import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test function to verify connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    console.log('Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('Supabase connection failed:', error);
    return false;
  }
};

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
          full_name: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          updated_at?: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
      };
      family_trees: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
          is_public: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
          is_public?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
          is_public?: boolean;
        };
      };
      persons: {
        Row: {
          id: string;
          family_tree_id: string;
          first_name: string;
          last_name: string;
          birth_date: string | null;
          death_date: string | null;
          gender: 'male' | 'female' | 'other';
          biography: string | null;
          created_at: string;
          updated_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          family_tree_id: string;
          first_name: string;
          last_name: string;
          birth_date?: string | null;
          death_date?: string | null;
          gender: 'male' | 'female' | 'other';
          biography?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          family_tree_id?: string;
          first_name?: string;
          last_name?: string;
          birth_date?: string | null;
          death_date?: string | null;
          gender?: 'male' | 'female' | 'other';
          biography?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string;
        };
      };
      relationships: {
        Row: {
          id: string;
          family_tree_id: string;
          person1_id: string;
          person2_id: string;
          relationship_type: 'parent' | 'child' | 'spouse' | 'sibling';
          created_at: string;
          updated_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          family_tree_id: string;
          person1_id: string;
          person2_id: string;
          relationship_type: 'parent' | 'child' | 'spouse' | 'sibling';
          created_at?: string;
          updated_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          family_tree_id?: string;
          person1_id?: string;
          person2_id?: string;
          relationship_type?: 'parent' | 'child' | 'spouse' | 'sibling';
          created_at?: string;
          updated_at?: string;
          created_by?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          family_tree_id: string;
          person_id: string | null;
          title: string;
          description: string | null;
          file_url: string;
          file_type: string;
          created_at: string;
          updated_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          family_tree_id: string;
          person_id?: string | null;
          title: string;
          description?: string | null;
          file_url: string;
          file_type: string;
          created_at?: string;
          updated_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          family_tree_id?: string;
          person_id?: string | null;
          title?: string;
          description?: string | null;
          file_url?: string;
          file_type?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}; 