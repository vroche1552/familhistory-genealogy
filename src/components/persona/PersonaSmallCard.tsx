
import { Link } from 'react-router-dom';

interface Person {
  id: string;
  name: string;
  birthYear?: string;
  deathYear?: string;
  imageUrl?: string;
}

interface PersonaSmallCardProps {
  person: Person;
}

const PersonaSmallCard: React.FC<PersonaSmallCardProps> = ({ person }) => {
  return (
    <Link to={`/persona/${person.id}`} className="block w-40">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border border-gray-300">
          {person.imageUrl ? (
            <img 
              src={person.imageUrl} 
              alt={person.name} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              {person.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="mt-1">
          <p className="font-medium text-xs text-black truncate">{person.name}</p>
          <p className="text-[10px] text-gray-500">
            {person.birthYear}{person.birthYear && person.deathYear && "-"}{person.deathYear || ""}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PersonaSmallCard;
