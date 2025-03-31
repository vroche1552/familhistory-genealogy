
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  User, 
  SortAsc, 
  SortDesc, 
  Calendar 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Person {
  id: string;
  name: string;
  documentCount: number;
  imageUrl?: string;
  birthYear?: string;
  deathYear?: string;
}

interface DocumentationRankingProps {
  people: Person[];
}

type SortDirection = 'asc' | 'desc';

const DocumentationRanking: React.FC<DocumentationRankingProps> = ({ people: initialPeople }) => {
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [people, setPeople] = useState<Person[]>(
    [...initialPeople].sort((a, b) => 
      sortDirection === 'desc' ? b.documentCount - a.documentCount : a.documentCount - b.documentCount
    )
  );

  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    setSortDirection(newDirection);
    setPeople(prev => 
      [...prev].sort((a, b) => 
        newDirection === 'desc' ? b.documentCount - a.documentCount : a.documentCount - b.documentCount
      )
    );
  };

  return (
    <Card className="border border-gray-800 bg-black">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-xl">
            <FileText className="h-5 w-5 mr-2 text-cyber-accent" />
            Family Documentation Ranking
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSortDirection}
            className="text-xs"
          >
            {sortDirection === 'desc' ? (
              <SortDesc className="h-4 w-4 mr-1" />
            ) : (
              <SortAsc className="h-4 w-4 mr-1" />
            )}
            {sortDirection === 'desc' ? 'Highest First' : 'Lowest First'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {people.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No family members with documentation yet.
            </div>
          ) : (
            people.map((person, index) => (
              <Link 
                key={person.id} 
                to={`/persona/${person.id}?tab=documents`}
                className="block"
              >
                <div className="flex items-center p-2 rounded-md hover:bg-gray-900 transition-colors">
                  <div className="flex-shrink-0 mr-3 text-muted-foreground w-6 text-center">
                    {index + 1}
                  </div>
                  
                  <Avatar className="h-8 w-8 mr-3">
                    {person.imageUrl ? (
                      <AvatarImage src={person.imageUrl} alt={person.name} />
                    ) : (
                      <AvatarFallback className="bg-cyber-dark text-muted-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="flex-grow">
                    <div className="font-medium">{person.name}</div>
                    {(person.birthYear || person.deathYear) && (
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {person.birthYear}{person.deathYear && ` - ${person.deathYear}`}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center bg-cyber-dark px-2 py-1 rounded text-sm">
                    <FileText className="h-3 w-3 mr-1 text-cyber-accent" />
                    <span>{person.documentCount}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentationRanking;
