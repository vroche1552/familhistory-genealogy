
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, ZoomIn, ZoomOut } from 'lucide-react';
import PersonaCard from '../persona/PersonaCard';

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
    },
    { 
      id: '4', 
      name: 'Sarah Doe', 
      birthYear: '1978', 
      imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      parents: ['1', '2'], 
      children: [], 
      partners: [] 
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

  return (
    <div className="w-full h-[calc(100vh-64px)] relative overflow-hidden bg-cyber-dark/30 rounded-md border border-cyber-border/30">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button variant="outline" size="icon" onClick={handleZoomIn} className="cyber-button">
          <ZoomIn className="h-3 w-3" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut} className="cyber-button">
          <ZoomOut className="h-3 w-3" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleAddPerson} className="cyber-button">
          <PlusCircle className="h-3 w-3" />
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
            {/* Simple tree layout for demonstration */}
            <div className="flex flex-col items-center">
              {/* First generation - parents */}
              <div className="flex gap-6 mb-12">
                {people.filter(p => p.parents.length === 0).map((person) => (
                  <div key={person.id} className="relative">
                    <div className="flex flex-col items-center">
                      <PersonaCard person={person} />
                      
                      {/* Line underneath card */}
                      <div className="h-[8px] w-full border-l border-cyber-accent/40"></div>
                    </div>
                    
                    {/* Partner connection line */}
                    {person.partners.length > 0 && (
                      <div className="absolute h-[1px] bg-cyber-accent/40 w-6 top-20 -right-6"></div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Vertical connection line */}
              <div className="h-8 w-[1px] bg-cyber-accent/40 -mt-8"></div>
              
              {/* Second generation - children */}
              <div className="flex gap-6">
                {people.filter(p => p.parents.length > 0).map((person) => (
                  <div key={person.id} className="flex flex-col items-center">
                    <PersonaCard person={person} />
                    <div className="h-[8px] w-full border-l border-cyber-accent/40"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-cyber-background/80 p-2 rounded">
        <p>Drag to move • Scroll or use buttons to zoom</p>
      </div>
    </div>
  );
};

export default FamilyTree;
