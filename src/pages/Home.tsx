import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Trees,
  FileText,
  Globe,
  Clock,
  Brain,
  Users
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      icon: <Trees className="h-8 w-8" />,
      title: t('landing.features_list.family_tree.title'),
      description: t('landing.features_list.family_tree.description'),
      path: '/tree'
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: t('landing.features_list.document_management.title'),
      description: t('landing.features_list.document_management.description'),
      path: '/documents'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: t('landing.features_list.geographic.title'),
      description: t('landing.features_list.geographic.description'),
      path: '/map'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: t('landing.features_list.timeline.title'),
      description: t('landing.features_list.timeline.description'),
      path: '/timeline'
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: t('landing.features_list.ai_assistant.title'),
      description: t('landing.features_list.ai_assistant.description'),
      path: '/assistant'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: t('landing.features_list.collaboration.title'),
      description: t('landing.features_list.collaboration.description'),
      path: '/collaborate'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            {t('landing.welcome')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('landing.subtitle')}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
            >
              {t('landing.get_started')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/import')}
            >
              {t('landing.import_gedcom')}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('landing.features')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(feature.path)}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="text-primary">{feature.icon}</div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 