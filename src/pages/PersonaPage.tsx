import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import AiTextInput from '@/components/persona/AiTextInput';
import Changelog from '@/components/persona/Changelog';
import { Person } from '@/types';

interface ChangelogEntry {
  id: string;
  userId: string;
  userName: string;
  timestamp: Date;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  status: 'pending' | 'approved' | 'rejected';
}

const PersonaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [persona, setPersona] = useState<Person | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [changelogEntries, setChangelogEntries] = useState<ChangelogEntry[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchPersona = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch(`/api/personas/${id}`);
        if (!response.ok) throw new Error('Failed to fetch persona');
        const data = await response.json();
        setPersona(data.persona);
        setChangelogEntries(data.changelog);
        setIsAdmin(data.isAdmin);
      } catch (error) {
        toast({
          title: t('error'),
          description: t('error_fetching_persona'),
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersona();
  }, [id, t, toast]);

  const handleAiUpdate = async (updates: any) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/personas/${id}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update persona');
      
      const data = await response.json();
      setPersona(data.persona);
      setChangelogEntries(prev => [data.changelogEntry, ...prev]);
    } catch (error) {
      toast({
        title: t('error'),
        description: t('error_updating_persona'),
        variant: 'destructive',
      });
    }
  };

  const handleApproveChange = async (entryId: string) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/personas/${id}/changelog/${entryId}/approve`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to approve change');
      
      const data = await response.json();
      setChangelogEntries(prev =>
        prev.map(entry =>
          entry.id === entryId ? { ...entry, status: 'approved' } : entry
        )
      );
    } catch (error) {
      toast({
        title: t('error'),
        description: t('error_approving_change'),
        variant: 'destructive',
      });
    }
  };

  const handleRejectChange = async (entryId: string) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/personas/${id}/changelog/${entryId}/reject`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to reject change');
      
      const data = await response.json();
      setChangelogEntries(prev =>
        prev.map(entry =>
          entry.id === entryId ? { ...entry, status: 'rejected' } : entry
        )
      );
    } catch (error) {
      toast({
        title: t('error'),
        description: t('error_rejecting_change'),
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{t('persona_not_found')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{persona.name}</h1>
        <Button variant="outline">{t('edit')}</Button>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">{t('information')}</TabsTrigger>
          <TabsTrigger value="timeline">{t('timeline')}</TabsTrigger>
          <TabsTrigger value="changelog">{t('changelog')}</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('ai_input')}</CardTitle>
            </CardHeader>
            <CardContent>
              <AiTextInput onUpdate={handleAiUpdate} />
            </CardContent>
          </Card>

          {/* Existing persona information cards */}
          {/* ... */}
        </TabsContent>

        <TabsContent value="timeline">
          {/* Existing timeline component */}
          {/* ... */}
        </TabsContent>

        <TabsContent value="changelog">
          <Changelog
            entries={changelogEntries}
            isAdmin={isAdmin}
            onApprove={handleApproveChange}
            onReject={handleRejectChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonaPage; 