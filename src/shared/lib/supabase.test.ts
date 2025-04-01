import { supabase } from './supabase';

export async function testSupabaseSetup() {
  try {
    // Test database tables
    const tables = ['family_trees', 'persons', 'relationships'];
    for (const table of tables) {
      const { error } = await supabase.from(table).select('count').limit(1);
      if (error) {
        console.error(`Table ${table} does not exist or is not accessible:`, error);
        return false;
      }
    }

    // Test RLS policies
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies', { table_name: 'family_trees' });
    
    if (policiesError) {
      console.error('Failed to check RLS policies:', policiesError);
      return false;
    }

    // Test storage buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error('Failed to check storage buckets:', bucketsError);
      return false;
    }

    // Test Edge Functions
    const { data: functions, error: functionsError } = await supabase.functions.invoke('test-function');
    if (functionsError) {
      console.error('Failed to check Edge Functions:', functionsError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Supabase setup test failed:', error);
    return false;
  }
} 