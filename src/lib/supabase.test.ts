import { supabase } from './supabase';

export async function testSupabaseSetup() {
  try {
    // Test 1: Database Connection
    console.log('Testing database connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (connectionError) throw connectionError;
    console.log('✅ Database connection successful');

    // Test 2: Create Test User
    console.log('\nTesting user creation...');
    const testUser = {
      email: 'test@example.com',
      full_name: 'Test User'
    };
    
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([testUser])
      .select()
      .single();
    
    if (userError) throw userError;
    console.log('✅ User creation successful');
    
    // Test 3: Create Family Tree
    console.log('\nTesting family tree creation...');
    const testTree = {
      name: 'Test Family Tree',
      description: 'A test family tree',
      created_by: user.id,
      is_public: false
    };
    
    const { data: tree, error: treeError } = await supabase
      .from('family_trees')
      .insert([testTree])
      .select()
      .single();
    
    if (treeError) throw treeError;
    console.log('✅ Family tree creation successful');
    
    // Test 4: Create Person
    console.log('\nTesting person creation...');
    const testPerson = {
      family_tree_id: tree.id,
      first_name: 'John',
      last_name: 'Doe',
      gender: 'male',
      created_by: user.id
    };
    
    const { data: person, error: personError } = await supabase
      .from('persons')
      .insert([testPerson])
      .select()
      .single();
    
    if (personError) throw personError;
    console.log('✅ Person creation successful');
    
    // Test 5: Clean up test data
    console.log('\nCleaning up test data...');
    await supabase.from('family_trees').delete().eq('id', tree.id);
    await supabase.from('users').delete().eq('id', user.id);
    console.log('✅ Cleanup successful');
    
    console.log('\n🎉 All tests passed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
} 