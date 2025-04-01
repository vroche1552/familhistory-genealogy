import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trees, Plus, Search, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  const stats = {
    totalMembers: 6,
    totalDocuments: 50,
    generations: 3
  };

  const familyRanking = [
    { id: '1', name: 'Jean Dupont', birthYear: '1950', documentCount: 15 },
    { id: '2', name: 'Sophie Dupont', birthYear: '1980', documentCount: 12 },
    { id: '3', name: 'Anne Dupont', birthYear: '1953', documentCount: 8 },
    { id: '4', name: 'Marie Dupont', birthYear: '1925-1995', documentCount: 7 }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('dashboard.welcome')}</h1>
      <p className="text-muted-foreground mb-8">{t('dashboard.description')}</p>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link to="/tree">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-center py-6">
              <Trees className="h-6 w-6 mr-2" />
              <span>{t('dashboard.view_tree')}</span>
            </CardContent>
          </Card>
        </Link>
        <Link to="/tree/add">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-center py-6">
              <Plus className="h-6 w-6 mr-2" />
              <span>{t('dashboard.add_member')}</span>
            </CardContent>
          </Card>
        </Link>
        <Link to="/search">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-center py-6">
              <Search className="h-6 w-6 mr-2" />
              <span>{t('dashboard.search')}</span>
            </CardContent>
          </Card>
        </Link>
        <Link to="/timeline">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-center py-6">
              <Calendar className="h-6 w-6 mr-2" />
              <span>{t('dashboard.timeline')}</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.family_stats')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>{t('dashboard.total_members')}</span>
              <span className="font-bold">{stats.totalMembers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>{t('dashboard.total_documents')}</span>
              <span className="font-bold">{stats.totalDocuments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>{t('dashboard.generations')}</span>
              <span className="font-bold">{stats.generations}</span>
            </div>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link to="/tree">{t('dashboard.view_family_tree')}</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Documentation Ranking */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('dashboard.documentation_ranking')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {familyRanking.map((member, index) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold w-6">{index + 1}</span>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.birthYear}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{member.documentCount}</span>
                    <span className="text-sm text-muted-foreground">{t('dashboard.documents')}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
