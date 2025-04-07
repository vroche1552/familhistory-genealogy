import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/features/i18n/context/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const AddFamilyMember: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: 'other',
    biography: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);

      // First, create a family tree if one doesn't exist
      const { data: existingTrees, error: treesError } = await supabase
        .from('family_trees')
        .select('id')
        .eq('created_by', user.id)
        .limit(1);

      if (treesError) throw treesError;

      let treeId = existingTrees?.[0]?.id;

      if (!treeId) {
        const { data: newTree, error: createTreeError } = await supabase
          .from('family_trees')
          .insert({
            name: t('family.defaultTreeName'),
            created_by: user.id,
            is_public: false
          })
          .select('id')
          .single();

        if (createTreeError) throw createTreeError;
        treeId = newTree.id;
      }

      // Create the person
      const { error: personError } = await supabase
        .from('persons')
        .insert({
          family_tree_id: treeId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          birth_date: formData.birthDate || null,
          gender: formData.gender,
          biography: formData.biography || null,
          created_by: user.id
        });

      if (personError) throw personError;

      toast({
        title: t('family.memberAdded'),
        description: t('family.memberAddedDescription')
      });

      navigate(`/tree/${treeId}`);
    } catch (error: any) {
      console.error('Error adding family member:', error);
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('family.addMember')}</h1>
      <div className="bg-card rounded-lg shadow p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                {t('family.firstName')}
              </label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                {t('family.lastName')}
              </label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="birthDate" className="text-sm font-medium">
                {t('family.birthDate')}
              </label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="gender" className="text-sm font-medium">
                {t('family.gender')}
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="male">{t('family.genderMale')}</option>
                <option value="female">{t('family.genderFemale')}</option>
                <option value="other">{t('family.genderOther')}</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="biography" className="text-sm font-medium">
              {t('family.biography')}
            </label>
            <Textarea
              id="biography"
              name="biography"
              value={formData.biography}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('common.saving') : t('common.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFamilyMember; 