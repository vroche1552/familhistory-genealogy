
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { User, Calendar, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <Link to={`/persona/${person.id}`} aria-label={`View details for ${person.name}`}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
      >
        <Card 
          className="w-40 cyber-card overflow-hidden transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative h-32 overflow-hidden">
            {person.imageUrl ? (
              <img 
                src={person.imageUrl} 
                alt={`Portrait of ${person.name}`} 
                className="w-full h-full object-cover transition-transform duration-500"
                style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-cyber-dark flex items-center justify-center">
                <User className="h-12 w-12 text-cyber-foreground/30" aria-hidden="true" />
              </div>
            )}
            
            {isHovered && (
              <motion.div 
                className="absolute top-2 right-2 bg-cyber-dark/80 p-1 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Edit className="h-3 w-3 text-cyber-accent" aria-hidden="true" />
              </motion.div>
            )}
          </div>
          
          <CardContent className="p-3 text-center">
            <h3 className="font-semibold text-cyber-foreground text-sm truncate">{person.name}</h3>
            
            {(person.birthYear || person.deathYear) && (
              <div className="flex items-center justify-center mt-1 text-xs text-muted-foreground">
                <Calendar className="h-2.5 w-2.5 mr-1 inline" aria-hidden="true" />
                <span>
                  {person.birthYear && <span>{person.birthYear}</span>}
                  {person.birthYear && person.deathYear && <span> - </span>}
                  {person.deathYear && <span>{person.deathYear}</span>}
                </span>
              </div>
            )}
            
            {isDetailed && (
              <div className="mt-2 text-xs">
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
      </motion.div>
    </Link>
  );
};

export default PersonaCard;
