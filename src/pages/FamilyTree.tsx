import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trees, Plus, Search, Filter, Download, Upload } from 'lucide-react';
import { useFamily } from '@/contexts/FamilyContext';
import { Person, Location } from '@/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const FamilyTree: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { family, addPerson, updatePerson, deletePerson } = useFamily();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGeneration, setFilterGeneration] = useState<string>('all');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newPerson, setNewPerson] = useState<Partial<Person>>({
    firstName: '',
    lastName: '',
    birthDate: new Date(),
    gender: 'male',
    birthPlace: {
      city: '',
      country: '',
      coordinates: { latitude: 0, longitude: 0 }
    }
  });

  const currentFamily = family.find(f => f.id === id);

  if (!currentFamily) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">{t('family.family_not_found')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredMembers = currentFamily.members.filter(member => {
    const matchesSearch = searchQuery === '' || 
      member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGeneration = filterGeneration === 'all' || 
      member.generation.toString() === filterGeneration;
    
    return matchesSearch && matchesGeneration;
  });

  const handleAddPerson = () => {
    if (!newPerson.firstName || !newPerson.lastName) {
      toast({
        title: t('common.error'),
        description: t('family.first_last_name_required'),
        variant: 'destructive'
      });
      return;
    }

    const person: Person = {
      id: Date.now().toString(),
      firstName: newPerson.firstName,
      lastName: newPerson.lastName,
      birthDate: newPerson.birthDate || new Date().toISOString(),
      gender: newPerson.gender || 'male',
      birthPlace: newPerson.birthPlace || {
        city: '',
        country: '',
        coordinates: { latitude: 0, longitude: 0 }
      },
      generation: 1,
      parents: [],
      children: [],
      spouse: null,
      bio: '',
      documents: [],
      timeline: [],
      keyFacts: [],
      changelog: []
    };

    addPerson(id!, person);
    setIsAddingPerson(false);
    setNewPerson({
      firstName: '',
      lastName: '',
      birthDate: new Date(),
      gender: 'male',
      birthPlace: {
        city: '',
        country: '',
        coordinates: { latitude: 0, longitude: 0 }
      }
    });
    toast({
      title: t('common.success'),
      description: t('family.person_added')
    });
  };

  const handleUpdatePerson = () => {
    if (!selectedPerson) return;

    if (!newPerson.firstName || !newPerson.lastName) {
      toast({
        title: t('common.error'),
        description: t('family.first_last_name_required'),
        variant: 'destructive'
      });
      return;
    }

    const updatedPerson: Person = {
      ...selectedPerson,
      firstName: newPerson.firstName,
      lastName: newPerson.lastName,
      birthDate: newPerson.birthDate || selectedPerson.birthDate,
      gender: newPerson.gender || selectedPerson.gender,
      birthPlace: newPerson.birthPlace || selectedPerson.birthPlace
    };

    updatePerson(id!, updatedPerson);
    setIsEditing(false);
    setSelectedPerson(null);
    setNewPerson({
      firstName: '',
      lastName: '',
      birthDate: new Date(),
      gender: 'male',
      birthPlace: {
        city: '',
        country: '',
        coordinates: { latitude: 0, longitude: 0 }
      }
    });
    toast({
      title: t('common.success'),
      description: t('family.person_updated')
    });
  };

  const handleDeletePerson = (personId: string) => {
    deletePerson(id!, personId);
    toast({
      title: t('common.success'),
      description: t('family.person_deleted')
    });
  };

  const handleEditPerson = (person: Person) => {
    setSelectedPerson(person);
    setNewPerson({
      firstName: person.firstName,
      lastName: person.lastName,
      birthDate: person.birthDate.split('T')[0],
      gender: person.gender,
      birthPlace: person.birthPlace
    });
    setIsEditing(true);
  };

  const handleExportTree = () => {
    const treeData = {
      family: currentFamily,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(treeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentFamily.name}_family_tree.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportTree = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        // Here you would typically validate the data and update the family tree
        toast({
          title: t('common.success'),
          description: t('family.tree_imported')
        });
      } catch (error) {
        toast({
          title: t('common.error'),
          description: t('family.invalid_file'),
          variant: 'destructive'
        });
      }
    };
    reader.readAsText(file);
  };

  const handlePersonClick = (person: Person) => {
    navigate(`/person/${person.id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            {currentFamily.name} {t('family.family_tree')}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingPerson(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('family.add_person')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportTree}
            >
              <Download className="h-4 w-4 mr-2" />
              {t('family.export')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('import-input')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              {t('family.import')}
            </Button>
            <input
              id="import-input"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportTree}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">{t('common.search')}</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    placeholder={t('family.search_placeholder')}
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Label htmlFor="generation">{t('family.generation')}</Label>
                <Select
                  value={filterGeneration}
                  onValueChange={setFilterGeneration}
                >
                  <SelectTrigger id="generation">
                    <SelectValue placeholder={t('family.select_generation')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    {Array.from({ length: 5 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {t('family.generation')} {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Family Tree Display */}
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {filteredMembers.map((person) => (
                  <Card
                    key={person.id}
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => handlePersonClick(person)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {person.firstName} {person.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(person.birthDate), 'MMMM d, yyyy')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {person.birthPlace.city}, {person.birthPlace.country}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge>{t(`common.${person.gender}`)}</Badge>
                          <Badge variant="outline">
                            {t('family.generation')} {person.generation}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {(isAddingPerson || isEditing) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {isAddingPerson ? t('family.add_member') : t('common.edit')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('family.first_name')}</Label>
                <Input
                  id="firstName"
                  value={newPerson.firstName}
                  onChange={(e) => setNewPerson({ ...newPerson, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('family.last_name')}</Label>
                <Input
                  id="lastName"
                  value={newPerson.lastName}
                  onChange={(e) => setNewPerson({ ...newPerson, lastName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">{t('family.birth_date')}</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={newPerson.birthDate}
                  onChange={(e) => setNewPerson({ ...newPerson, birthDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">{t('family.gender')}</Label>
                <Select
                  value={newPerson.gender}
                  onValueChange={(value) => setNewPerson({ ...newPerson, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('family.select_gender')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t('family.male')}</SelectItem>
                    <SelectItem value="female">{t('family.female')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingPerson(false);
                    setIsEditing(false);
                    setSelectedPerson(null);
                    setNewPerson({
                      firstName: '',
                      lastName: '',
                      birthDate: new Date(),
                      gender: 'male',
                      birthPlace: {
                        city: '',
                        country: '',
                        coordinates: { latitude: 0, longitude: 0 }
                      }
                    });
                  }}
                >
                  {t('common.cancel')}
                </Button>
                <Button onClick={isAddingPerson ? handleAddPerson : handleUpdatePerson}>
                  {isAddingPerson ? t('common.add') : t('common.save')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FamilyTree; 