
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { User, Calendar, Edit } from 'lucide-react';

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

interface PersonaCardProps {
  person: Person;
  isDetailed?: boolean;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ person, isDetailed = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link to={`/persona/${person.id}`}>
      <Card 
        className="w-52 cyber-card overflow-hidden transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-40 overflow-hidden">
          {person.imageUrl ? (
            <img 
              src={person.imageUrl} 
              alt={person.name} 
              className="w-full h-full object-cover transition-transform duration-500"
              style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            />
          ) : (
            <div className="w-full h-full bg-cyber-dark flex items-center justify-center">
              <User className="h-16 w-16 text-cyber-foreground/30" />
            </div>
          )}
          
          {isHovered && (
            <div className="absolute top-2 right-2 bg-cyber-dark/80 p-1 rounded-full">
              <Edit className="h-4 w-4 text-cyber-accent" />
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-cyber-foreground truncate">{person.name}</h3>
          
          {(person.birthYear || person.deathYear) && (
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1 inline" />
              {person.birthYear && <span>{person.birthYear}</span>}
              {person.birthYear && person.deathYear && <span> - </span>}
              {person.deathYear && <span>{person.deathYear}</span>}
            </div>
          )}
          
          {isDetailed && (
            <div className="mt-3 text-sm">
              <div className="text-muted-foreground">
                <span className="text-cyber-accent">Parents:</span> {person.parents.length}
              </div>
              <div className="text-muted-foreground">
                <span className="text-cyber-accent">Children:</span> {person.children.length}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default PersonaCard;
