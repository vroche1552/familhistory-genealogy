import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/features/i18n/context/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface TreeData {
  id: string;
  name: string;
  created_by: string;
  is_public: boolean;
}

interface Person {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  gender: string;
  biography: string | null;
}

const Tree: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { treeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [tree, setTree] = useState<TreeData | null>(null);
  const [members, setMembers] = useState<Person[]>([]);

  useEffect(() => {
    const loadTree = async () => {
      try {
        setLoading(true);
        if (!user) return;

        // First, ensure the user has a profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          // Create profile if it doesn't exist
          const { error: createProfileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.name
            });

          if (createProfileError) throw createProfileError;
        }

        // If no treeId is provided, get the user's first tree or create one
        if (!treeId) {
          const { data: existingTrees, error: treesError } = await supabase
            .from('family_trees')
            .select('*')
            .eq('created_by', user.id)
            .limit(1);

          if (treesError) throw treesError;

          if (existingTrees && existingTrees.length > 0) {
            setTree(existingTrees[0]);
            navigate(`/tree/${existingTrees[0].id}`, { replace: true });
            return;
          }

          // No tree exists, create one
          const { data: newTree, error: createError } = await supabase
            .from('family_trees')
            .insert({
              name: t('family.defaultTreeName'),
              created_by: user.id,
              is_public: false
            })
            .select()
            .single();

          if (createError) throw createError;
          setTree(newTree);
          navigate(`/tree/${newTree.id}`, { replace: true });
          return;
        }

        // Load specific tree
        const { data: treeData, error: treeError } = await supabase
          .from('family_trees')
          .select('*')
          .eq('id', treeId)
          .single();

        if (treeError) throw treeError;
        setTree(treeData);

        // Load tree members
        const { data: membersData, error: membersError } = await supabase
          .from('persons')
          .select('*')
          .eq('family_tree_id', treeId);

        if (membersError) throw membersError;
        setMembers(membersData || []);

      } catch (error: any) {
        console.error('Error loading tree:', error);
        toast({
          title: t('common.error'),
          description: error.message,
          variant: 'destructive'
        });
        // Navigate to dashboard on error
        navigate('/dashboard', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadTree();
  }, [user, treeId, navigate, t, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">{t('family.noTreeFound')}</h1>
        <Button onClick={() => navigate('/tree/add')}>
          {t('family.createTree')}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{tree.name}</h1>
        <Button onClick={() => navigate('/tree/add')}>
          {t('family.addMember')}
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            {t('family.noMembersYet')}
          </p>
          <Button onClick={() => navigate('/tree/add')}>
            {t('family.addFirstMember')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-card rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              onClick={() => navigate(`/person/${member.id}`)}
              role="button"
              tabIndex={0}
            >
              <h3 className="text-xl font-semibold mb-2">
                {member.first_name} {member.last_name}
              </h3>
              {member.birth_date && (
                <p className="text-sm text-muted-foreground mb-2">
                  {t('family.born')}: {new Date(member.birth_date).toLocaleDateString()}
                </p>
              )}
              {member.biography && (
                <p className="text-sm line-clamp-3">{member.biography}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tree;
