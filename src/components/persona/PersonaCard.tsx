import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { User, Calendar } from 'lucide-react';
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
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/person/${person.id}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className="cursor-pointer"
    >
      <Card className={`w-32 h-40 relative overflow-hidden ${isHovered ? 'ring-2 ring-primary' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
        
        {person.imageUrl ? (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${person.imageUrl})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <User className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
          </div>
        )}

        <CardContent className="p-3 text-center relative z-20">
          <h3 className="font-semibold text-foreground text-sm truncate">{person.name}</h3>
          
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
                <span className="text-primary">Parents:</span> {person.parents.length}
              </div>
              <div className="text-muted-foreground">
                <span className="text-primary">Children:</span> {person.children.length}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PersonaCard;
