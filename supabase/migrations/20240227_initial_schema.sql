-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Create family_trees table
CREATE TABLE IF NOT EXISTS family_trees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_public BOOLEAN DEFAULT false
);

-- Create persons table
CREATE TABLE IF NOT EXISTS persons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  family_tree_id UUID REFERENCES family_trees(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date DATE,
  death_date DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  biography TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create relationships table
CREATE TABLE IF NOT EXISTS relationships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  family_tree_id UUID REFERENCES family_trees(id) ON DELETE CASCADE,
  person1_id UUID REFERENCES persons(id) ON DELETE CASCADE,
  person2_id UUID REFERENCES persons(id) ON DELETE CASCADE,
  relationship_type TEXT CHECK (relationship_type IN ('parent', 'child', 'spouse', 'sibling')),
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Family trees policies
CREATE POLICY "Public trees are viewable by everyone" ON family_trees
  FOR SELECT USING (is_public = true);

CREATE POLICY "Private trees are viewable by owner" ON family_trees
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Trees are insertable by authenticated users" ON family_trees
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Trees are updatable by owner" ON family_trees
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Trees are deletable by owner" ON family_trees
  FOR DELETE USING (auth.uid() = created_by);

-- Persons policies
CREATE POLICY "Persons in public trees are viewable" ON persons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM family_trees
      WHERE id = family_tree_id
      AND (is_public = true OR created_by = auth.uid())
    )
  );

CREATE POLICY "Persons are insertable by tree owner" ON persons
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_trees
      WHERE id = family_tree_id
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Persons are updatable by tree owner" ON persons
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM family_trees
      WHERE id = family_tree_id
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Persons are deletable by tree owner" ON persons
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM family_trees
      WHERE id = family_tree_id
      AND created_by = auth.uid()
    )
  );

-- Relationships policies
CREATE POLICY "Relationships in public trees are viewable" ON relationships
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM family_trees
      WHERE id = family_tree_id
      AND (is_public = true OR created_by = auth.uid())
    )
  );

CREATE POLICY "Relationships are insertable by tree owner" ON relationships
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_trees
      WHERE id = family_tree_id
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Relationships are updatable by tree owner" ON relationships
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM family_trees
      WHERE id = family_tree_id
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Relationships are deletable by tree owner" ON relationships
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM family_trees
      WHERE id = family_tree_id
      AND created_by = auth.uid()
    )
  );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 