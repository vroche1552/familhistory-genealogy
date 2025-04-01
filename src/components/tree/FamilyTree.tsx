import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, ZoomIn, ZoomOut } from 'lucide-react';
import PersonaCard from '../persona/PersonaCard';
import { useFamily } from '@/contexts/FamilyContext';
import { Person } from '@/types';

interface TreeProps {
  initialData?: Person[];
}

const FamilyTree: React.FC<TreeProps> = ({ initialData = [] }) => {
  const { family } = useFamily();
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

  // Get all members from all families
  const allMembers = family.flatMap(f => f.members);

  // Group members by their relation depth (parents -> children)
  const membersByGeneration = allMembers.reduce((acc, member) => {
    // Calculate generation based on relations
    const generation = member.relations.some(r => r.relationType === 'parent') ? 1 : 0;
    if (!acc[generation]) acc[generation] = [];
    acc[generation].push(member);
    return acc;
  }, {} as Record<number, Person[]>);

  // Sort generations
  const generations = Object.keys(membersByGeneration)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="w-full h-[calc(100vh-64px)] relative overflow-hidden bg-background/30 rounded-md border">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button variant="outline" size="icon" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
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
            {/* Render generations */}
            <div className="flex flex-col gap-16">
              {generations.map(gen => (
                <div key={gen} className="flex gap-8 justify-center">
                  {membersByGeneration[gen].map(person => (
                    <div key={person.id} className="relative">
                      <PersonaCard
                        person={{
                          id: person.id,
                          name: `${person.firstName} ${person.lastName}`,
                          birthYear: new Date(person.birthDate).getFullYear().toString(),
                          deathYear: person.deathDate ? new Date(person.deathDate).getFullYear().toString() : undefined,
                          imageUrl: person.photo,
                          parents: person.relations.filter(r => r.relationType === 'parent').map(r => r.id),
                          children: person.relations.filter(r => r.relationType === 'child').map(r => r.id),
                          partners: person.relations.filter(r => r.relationType === 'spouse').map(r => r.id)
                        }}
                        isDetailed
                      />
                      
                      {/* Draw lines to children */}
                      {person.relations.some(r => r.relationType === 'child') && (
                        <div className="absolute left-1/2 bottom-0 w-px h-16 bg-border -mb-16 transform -translate-x-1/2" />
                      )}
                      
                      {/* Draw lines to spouse */}
                      {person.relations.some(r => r.relationType === 'spouse') && (
                        <div className="absolute top-1/2 right-0 w-8 h-px bg-border -mr-8" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 p-2 rounded">
        <p>Drag to move • Scroll or use buttons to zoom</p>
      </div>
    </div>
  );
};

export default FamilyTree;
