
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  TreePine, 
  FileText, 
  Calendar, 
  Search,
  PlusCircle,
  Trees
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import DocumentationRanking from '@/components/documentation/DocumentationRanking';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock data for demonstration
const familyMembers = [
  { 
    id: '1', 
    name: 'Jean Dupont', 
    documentCount: 15, 
    imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    birthYear: '1950'
  },
  { 
    id: '2', 
    name: 'Anne Dupont', 
    documentCount: 8, 
    imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    birthYear: '1953'
  },
  { 
    id: '3', 
    name: 'Michel Dupont', 
    documentCount: 5, 
    imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    birthYear: '1977'
  },
  { 
    id: '4', 
    name: 'Sophie Dupont', 
    documentCount: 12, 
    imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
    birthYear: '1980'
  },
  { 
    id: '5', 
    name: 'Jacques Dupont', 
    documentCount: 3, 
    imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    birthYear: '1920',
    deathYear: '1990'
  },
  { 
    id: '6', 
    name: 'Marie Dupont', 
    documentCount: 7, 
    imageUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
    birthYear: '1925',
    deathYear: '1995'
  },
];

const Dashboard = () => {
  const { t, language } = useLanguage();
  
  return (
    <div className="min-h-screen bg-cyber-background text-cyber-foreground flex flex-col intelligence-pattern">
      <Navbar />
      
      <main className="flex-grow p-4">
        <div className="container mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold cyber-text-gradient mb-2">
              {language === 'fr' ? 'Tableau de Bord' : 'Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'fr' 
                ? 'Bienvenue dans votre espace personnel de généalogie' 
                : 'Welcome to your personal genealogy space'}
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link to="/tree">
              <Card className="hover:border-cyber-accent transition-colors cyber-card h-full">
                <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
                  <Trees className="h-8 w-8 mb-2 text-cyber-accent" />
                  <span>{t('family_tree')}</span>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/tree?mode=add">
              <Card className="hover:border-cyber-accent transition-colors cyber-card h-full">
                <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
                  <PlusCircle className="h-8 w-8 mb-2 text-cyber-accent" />
                  <span>{language === 'fr' ? 'Ajouter Membre' : 'Add Member'}</span>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/search">
              <Card className="hover:border-cyber-accent transition-colors cyber-card h-full">
                <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
                  <Search className="h-8 w-8 mb-2 text-cyber-accent" />
                  <span>{t('search')}</span>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/timeline">
              <Card className="hover:border-cyber-accent transition-colors cyber-card h-full">
                <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
                  <Calendar className="h-8 w-8 mb-2 text-cyber-accent" />
                  <span>{t('timeline')}</span>
                </CardContent>
              </Card>
            </Link>
          </div>
          
          {/* Stats and Documentation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Family Stats */}
            <div className="lg:col-span-1">
              <Card className="border border-gray-800 bg-black h-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Users className="h-5 w-5 mr-2 text-cyber-accent" />
                    {language === 'fr' ? 'Statistiques Familiales' : 'Family Statistics'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{language === 'fr' ? 'Membres Totaux' : 'Total Members'}</span>
                    </div>
                    <span className="font-semibold">{familyMembers.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{language === 'fr' ? 'Documents Totaux' : 'Total Documents'}</span>
                    </div>
                    <span className="font-semibold">
                      {familyMembers.reduce((sum, person) => sum + person.documentCount, 0)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{language === 'fr' ? 'Générations' : 'Generations'}</span>
                    </div>
                    <span className="font-semibold">3</span>
                  </div>
                  
                  <div className="pt-2">
                    <Link to="/tree">
                      <Button variant="outline" className="w-full cyber-button">
                        <Trees className="h-4 w-4 mr-2" />
                        {language === 'fr' ? 'Voir l\'Arbre Familial' : 'View Family Tree'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Documentation Ranking */}
            <div className="lg:col-span-2">
              <DocumentationRanking people={familyMembers} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
