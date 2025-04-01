import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Save, Upload, Download, Share2 } from 'lucide-react';
import FamilyTree from '@/components/tree/FamilyTree';
import { useFamily } from '@/contexts/FamilyContext';

const Tree = () => {
  const { t } = useLanguage();
  const { family } = useFamily();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t('family.family_tree')}</h1>
              <p className="text-muted-foreground mt-1">
                {family.length} {t('family.members')}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <PlusCircle className="h-4 w-4 mr-2" /> {t('family.add_person')}
              </Button>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" /> {t('common.save')}
              </Button>
              <Link to="/import">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" /> {t('family.import')}
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> {t('family.export')}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" /> {t('common.share')}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tree View */}
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>{t('family.visualization')}</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[600px] p-0">
            <FamilyTree />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Tree;
