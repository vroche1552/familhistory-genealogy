
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, ZoomIn, ZoomOut, Move } from 'lucide-react';
import PersonCard from '../persona/PersonaCard';

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

interface TreeProps {
  initialData?: Person[];
}

const FamilyTree: React.FC<TreeProps> = ({ initialData = [] }) => {
  const [people, setPeople] = useState<Person[]>(initialData.length > 0 ? initialData : [
    { 
      id: '1', 
      name: 'Jean Dupont', 
      birthYear: '1950', 
      deathYear: '',
      imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      parents: [], 
      children: ['3', '4'], 
      partners: ['2'] 
    },
    { 
      id: '2', 
      name: 'Anne Dupont', 
      birthYear: '1953', 
      deathYear: '',
      imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
      parents: [], 
      children: ['3', '4'], 
      partners: ['1'] 
    },
    { 
      id: '3', 
      name: 'Michel Dupont', 
      birthYear: '1975', 
      deathYear: '',
      imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
      parents: ['1', '2'], 
      children: ['5'], 
      partners: ['6'] 
    },
    { 
      id: '4', 
      name: 'Sophie Dupont', 
      birthYear: '1978', 
      deathYear: '',
      imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      parents: ['1', '2'], 
      children: [], 
      partners: [] 
    },
    { 
      id: '5', 
      name: 'Thomas Dupont', 
      birthYear: '2005', 
      deathYear: '',
      imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
      parents: ['3', '6'], 
      children: [], 
      partners: [] 
    },
    { 
      id: '6', 
      name: 'Marie Dupont', 
      birthYear: '1980', 
      deathYear: '',
      imageUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
      parents: [], 
      children: ['5'], 
      partners: ['3'] 
    }
  ]);
  
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const treeRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {  // Left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleAddPerson = () => {
    const newId = (people.length + 1).toString();
    const newPerson: Person = {
      id: newId,
      name: `New Person ${newId}`,
      birthYear: '',
      parents: [],
      children: [],
      partners: []
    };
    
    setPeople(prev => [...prev, newPerson]);
  };

  // Get the earliest ancestors (people without parents)
  const getAncestors = () => {
    return people.filter(person => person.parents.length === 0);
  };

  // Find people by their IDs
  const findPeopleByIds = (ids: string[]) => {
    return people.filter(person => ids.includes(person.id));
  };

  // Get partners with their children for a person
  const getPartnersWithChildren = (personId: string) => {
    const person = people.find(p => p.id === personId);
    if (!person) return [];

    return person.partners.map(partnerId => {
      const partner = people.find(p => p.id === partnerId);
      if (!partner) return null;

      // Find children of this partnership
      const children = people.filter(p => 
        p.parents.includes(personId) && p.parents.includes(partnerId)
      );

      return { partner, children };
    }).filter(Boolean);
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] relative overflow-hidden bg-white border border-gray-200">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button variant="outline" size="icon" onClick={handleZoomIn} className="bg-white text-black border-gray-300">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut} className="bg-white text-black border-gray-300">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleAddPerson} className="bg-white text-black border-gray-300">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Tree container */}
      <div 
        ref={treeRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Tree visualization */}
        <div 
          className="relative w-full h-full"
          style={{
            transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
            transformOrigin: 'center',
            transition: isDragging ? 'none' : 'transform 0.2s ease'
          }}
        >
          {/* Tree content - centered initially */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* Geneanet-style family tree layout */}
            <div className="flex flex-col items-center">
              {/* Ancestors level (parents and grandparents) */}
              <div className="flex justify-center mb-16">
                {getAncestors().map((ancestor) => (
                  <div key={ancestor.id} className="mx-2 relative group">
                    {/* Person card with border styling similar to Geneanet */}
                    <div className={`border-2 ${ancestor.gender === 'female' ? 'border-pink-300' : 'border-blue-300'} bg-gray-50 rounded-md overflow-hidden`}>
                      <div className="p-1">
                        <PersonCard person={ancestor} isSmall={true} />
                      </div>
                    </div>
                    
                    {/* Connecting lines for partners */}
                    {ancestor.partners.length > 0 && (
                      <div className="absolute h-[2px] bg-gray-400 w-8 top-1/2 -right-8"></div>
                    )}
                    
                    {/* Vertical line down to children if they exist */}
                    {ancestor.children.length > 0 && (
                      <div className="absolute w-[2px] h-16 bg-gray-400 bottom-0 left-1/2 -translate-x-1/2 -mb-16"></div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Children level */}
              <div className="flex justify-center gap-8">
                {people.filter(p => p.parents.length > 0 && p.children.length === 0).map((person) => (
                  <div key={person.id} className="relative group">
                    <div className={`border-2 ${person.gender === 'female' ? 'border-pink-300' : 'border-blue-300'} bg-gray-50 rounded-md overflow-hidden`}>
                      <div className="p-1">
                        <PersonCard person={person} isSmall={true} />
                      </div>
                    </div>
                    
                    {/* Vertical line up to parents */}
                    <div className="absolute w-[2px] h-16 bg-gray-400 top-0 left-1/2 -translate-x-1/2 -mt-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-sm text-black bg-white/80 p-2 rounded">
        <p>Drag to move • Scroll or use buttons to zoom</p>
      </div>
    </div>
  );
};

export default FamilyTree;
