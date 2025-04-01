-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
AND table_name IN ('users', 'family_trees', 'persons', 'relationships', 'documents')
ORDER BY table_name; 