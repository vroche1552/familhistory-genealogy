import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trees, Calendar, Users, FileText, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import PersonaCard from '@/components/persona/PersonaCard';

interface Person {
  id: string;
  name: string;
  birthYear?: string;
  deathYear?: string;
  imageUrl?: string;
  parents: string[];
  children: string[];
  partners: string[];
}

const Dashboard = () => {
  const [recentPersonas] = useState<Person[]>([
    { 
      id: '1', 
      name: 'John Doe', 
      birthYear: '1950', 
      imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      parents: [], 
      children: ['3', '4'], 
      partners: ['2'] 
    },
    { 
      id: '2', 
      name: 'Jane Doe', 
      birthYear: '1953', 
      imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
      parents: [], 
      children: ['3', '4'], 
      partners: ['1'] 
    },
    { 
      id: '3', 
      name: 'Michael Doe', 
      birthYear: '1975', 
      imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
      parents: ['1', '2'], 
      children: [], 
      partners: [] 
    }
  ]);

  return (
    <div className="min-h-screen bg-cyber-background text-cyber-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold cyber-text-gradient mb-4 md:mb-0">Dashboard</h1>
            <div className="flex gap-4">
              <Link to="/tree">
                <Button className="cyber-button flex items-center">
                  <Trees className="mr-2 h-4 w-4" /> View Family Tree
                </Button>
              </Link>
              <Button className="bg-cyber-accent hover:bg-cyber-accent/80 text-black font-medium flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Person
              </Button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="cyber-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Family Members
                </CardTitle>
                <Users className="h-4 w-4 text-cyber-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Including all generations
                </p>
              </CardContent>
            </Card>
            
            <Card className="cyber-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Oldest Record
                </CardTitle>
                <Calendar className="h-4 w-4 text-cyber-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1867</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Emma Mitchell (Great-Great-Grandmother)
                </p>
              </CardContent>
            </Card>
            
            <Card className="cyber-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Uploaded Documents
                </CardTitle>
                <FileText className="h-4 w-4 text-cyber-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Photos, certificates, and records
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Personas */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-cyber-foreground">Recently Viewed Profiles</h2>
              <Button variant="outline" size="sm" className="text-cyber-accent border-cyber-accent/30">
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentPersonas.map((person) => (
                <PersonaCard key={person.id} person={person} isDetailed={true} />
              ))}
              
              <Link to="/persona/new">
                <Card className="w-full h-full cyber-card flex flex-col items-center justify-center p-8 border border-dashed border-cyber-border/50 hover:border-cyber-accent/50 transition-colors cursor-pointer">
                  <PlusCircle className="h-12 w-12 text-cyber-accent/50 mb-4" />
                  <p className="text-center text-muted-foreground">Add New Person</p>
                </Card>
              </Link>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-cyber-foreground mb-6">Quick Actions</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/tree">
                <Card className="cyber-card hover:shadow-[0_0_10px_rgba(0,255,255,0.15)] transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Trees className="h-10 w-10 text-cyber-accent mb-4" />
                    <h3 className="font-medium mb-2">Manage Family Tree</h3>
                    <p className="text-sm text-muted-foreground">
                      Edit connections and relationships
                    </p>
                  </CardContent>
                </Card>
              </Link>
              
              <Card className="cyber-card hover:shadow-[0_0_10px_rgba(0,255,255,0.15)] transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <FileText className="h-10 w-10 text-cyber-accent mb-4" />
                  <h3 className="font-medium mb-2">Import/Export Data</h3>
                  <p className="text-sm text-muted-foreground">
                    GEDCOM file format supported
                  </p>
                </CardContent>
              </Card>
              
              <Card className="cyber-card hover:shadow-[0_0_10px_rgba(0,255,255,0.15)] transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Users className="h-10 w-10 text-cyber-accent mb-4" />
                  <h3 className="font-medium mb-2">Invite Family</h3>
                  <p className="text-sm text-muted-foreground">
                    Collaborate on your family tree
                  </p>
                </CardContent>
              </Card>
              
              <Card className="cyber-card hover:shadow-[0_0_10px_rgba(0,255,255,0.15)] transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Settings className="h-10 w-10 text-cyber-accent mb-4" />
                  <h3 className="font-medium mb-2">Account Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage privacy and preferences
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
