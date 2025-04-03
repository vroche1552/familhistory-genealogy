import { mockSupabaseClient } from './supabaseMock';

jest.mock('@/shared/lib/supabase', () => ({
  supabase: mockSupabaseClient,
})); 