-- Enable Row Level Security for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Family trees policies
CREATE POLICY "Anyone can view public family trees"
    ON family_trees FOR SELECT
    USING (is_public = true);

CREATE POLICY "Users can view their own family trees"
    ON family_trees FOR SELECT
    USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own family trees"
    ON family_trees FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own family trees"
    ON family_trees FOR UPDATE
    USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own family trees"
    ON family_trees FOR DELETE
    USING (auth.uid() = created_by);

-- Persons policies
CREATE POLICY "Anyone can view persons in public family trees"
    ON persons FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM family_trees
        WHERE family_trees.id = persons.family_tree_id
        AND family_trees.is_public = true
    ));

CREATE POLICY "Users can view persons in their own family trees"
    ON persons FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM family_trees
        WHERE family_trees.id = persons.family_tree_id
        AND family_trees.created_by = auth.uid()
    ));

CREATE POLICY "Users can create persons in their own family trees"
    ON persons FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM family_trees
        WHERE family_trees.id = family_tree_id
        AND family_trees.created_by = auth.uid()
    ));

CREATE POLICY "Users can update persons in their own family trees"
    ON persons FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM family_trees
        WHERE family_trees.id = persons.family_tree_id
        AND family_trees.created_by = auth.uid()
    ));

CREATE POLICY "Users can delete persons in their own family trees"
    ON persons FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM family_trees
        WHERE family_trees.id = persons.family_tree_id
        AND family_trees.created_by = auth.uid()
    ));

-- Relationships policies
CREATE POLICY "Anyone can view relationships in public family trees"
    ON relationships FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM family_trees
        WHERE family_trees.id = relationships.family_tree_id
        AND family_trees.is_public = true
    ));

CREATE POLICY "Users can view relationships in their own family trees"
    ON relationships FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM family_trees
        WHERE family_trees.id = relationships.family_tree_id
        AND family_trees.created_by = auth.uid()
    ));

CREATE POLICY "Users can create relationships in their own family trees"
    ON relationships FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM family_trees
        WHERE family_trees.id = family_tree_id
        AND family_trees.created_by = auth.uid()
    ));

CREATE POLICY "Users can update relationships in their own family trees"
    ON relationships FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM family_trees
        WHERE family_trees.id = relationships.family_tree_id
        AND family_trees.created_by = auth.uid()
    ));

CREATE POLICY "Users can delete relationships in their own family trees"
    ON relationships FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM family_trees
        WHERE family_trees.id = relationships.family_tree_id
        AND family_trees.created_by = auth.uid()
    ));

-- Documents policies
CREATE POLICY "Anyone can view documents in public family trees"
    ON documents FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM family_trees
        WHERE family_trees.id = documents.family_tree_id
        AND family_trees.is_public = true
    ));

CREATE POLICY "Users can view documents in their own family trees"
    ON documents FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM family_trees
        WHERE family_trees.id = documents.family_tree_id
        AND family_trees.created_by = auth.uid()
    ));

CREATE POLICY "Users can create documents in their own family trees"
    ON documents FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM family_trees
        WHERE family_trees.id = family_tree_id
        AND family_trees.created_by = auth.uid()
    ));

CREATE POLICY "Users can update documents in their own family trees"
    ON documents FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM family_trees
        WHERE family_trees.id = documents.family_tree_id
        AND family_trees.created_by = auth.uid()
    ));

CREATE POLICY "Users can delete documents in their own family trees"
    ON documents FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM family_trees
        WHERE family_trees.id = documents.family_tree_id
        AND family_trees.created_by = auth.uid()
    )); 