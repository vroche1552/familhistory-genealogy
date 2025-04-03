import React, { useState, useCallback } from 'react';
import { useFamily } from '../hooks/useFamily';
import { Person } from '../types';

interface TreeNode {
  id: string;
  name: string;
  children: TreeNode[];
  spouse?: TreeNode;
}

interface Relationship {
  fromId: string;
  toId: string;
  type: 'parent' | 'spouse' | 'sibling';
}

interface TreeLayout {
  orientation: 'horizontal' | 'vertical';
  spacing: number;
  nodeSize: number;
}

const FamilyTree: React.FC = () => {
  const { persons, relationships } = useFamily();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [layout, setLayout] = useState<TreeLayout>({
    orientation: 'horizontal',
    spacing: 100,
    nodeSize: 150
  });

  const buildTree = useCallback((personId: string): TreeNode => {
    const person = persons.find((p: Person) => p.id === personId);
    if (!person) throw new Error('Person not found');

    // Find children
    const children = relationships
      .filter((r: Relationship) => r.fromId === personId && r.type === 'parent')
      .map((r: Relationship) => buildTree(r.toId));

    // Find spouse
    const spouseRelationship = relationships.find(
      (r: Relationship) => 
        (r.fromId === personId || r.toId === personId) && 
        r.type === 'spouse'
    );

    const spouse = spouseRelationship 
      ? buildTree(spouseRelationship.fromId === personId ? spouseRelationship.toId : spouseRelationship.fromId)
      : undefined;

    return {
      id: person.id,
      name: person.name,
      children,
      spouse
    };
  }, [persons, relationships]);

  const handleNodeClick = (person: Person) => {
    setSelectedPerson(person);
  };

  const handleZoom = (delta: number) => {
    setScale(prev => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (e.buttons === 1) { // Left mouse button
      setPosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  };

  const handleExport = () => {
    const treeData = {
      persons,
      relationships,
      layout
    };
    
    const dataStr = JSON.stringify(treeData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'family-tree.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleLayoutChange = (key: keyof TreeLayout, value: any) => {
    setLayout(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderNode = (node: TreeNode) => {
    const person = persons.find((p: Person) => p.id === node.id);
    if (!person) return null;

    const nodeStyle = {
      transform: `scale(${scale})`,
      left: position.x,
      top: position.y,
      width: layout.nodeSize,
      margin: layout.spacing / 2
    };

    return (
      <div key={node.id} className="node-group">
        <div
          className="tree-node"
          onClick={() => handleNodeClick(person)}
          style={nodeStyle}
        >
          <div className="node-content">
            <div className="node-name">{person.name}</div>
            {person.birthDate && (
              <div className="node-dates">
                {person.birthDate} - {person.deathDate || 'Present'}
              </div>
            )}
          </div>
        </div>

        {node.spouse && (
          <div className="spouse-connector">
            <div
              className="tree-node spouse-node"
              onClick={() => handleNodeClick(persons.find(p => p.id === node.spouse?.id)!)}
              style={nodeStyle}
            >
              <div className="node-content">
                <div className="node-name">{node.spouse.name}</div>
                {persons.find(p => p.id === node.spouse?.id)?.birthDate && (
                  <div className="node-dates">
                    {persons.find(p => p.id === node.spouse?.id)?.birthDate} - {persons.find(p => p.id === node.spouse?.id)?.deathDate || 'Present'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {node.children.length > 0 && (
          <div className="node-children" style={{ flexDirection: layout.orientation === 'horizontal' ? 'row' : 'column' }}>
            {node.children.map(child => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  // Find root person (person with no incoming relationships)
  const rootPerson = persons.find((person: Person) => 
    !relationships.some((r: Relationship) => r.toId === person.id)
  );

  if (!rootPerson) {
    return <div>No family tree data available</div>;
  }

  const tree = buildTree(rootPerson.id);

  return (
    <div className="family-tree">
      <div className="tree-controls">
        <button onClick={() => handleZoom(0.1)}>Zoom In</button>
        <button onClick={() => handleZoom(-0.1)}>Zoom Out</button>
        <button onClick={handleExport}>Export Tree</button>
        
        <div className="layout-controls">
          <label>
            Orientation:
            <select 
              value={layout.orientation}
              onChange={(e) => handleLayoutChange('orientation', e.target.value)}
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </label>
          
          <label>
            Spacing:
            <input 
              type="number" 
              value={layout.spacing}
              onChange={(e) => handleLayoutChange('spacing', parseInt(e.target.value))}
              min="50"
              max="200"
            />
          </label>
          
          <label>
            Node Size:
            <input 
              type="number" 
              value={layout.nodeSize}
              onChange={(e) => handleLayoutChange('nodeSize', parseInt(e.target.value))}
              min="100"
              max="300"
            />
          </label>
        </div>
      </div>
      
      <div 
        className="tree-container"
        onMouseMove={handleDrag}
      >
        {renderNode(tree)}
      </div>

      {selectedPerson && (
        <div className="person-modal">
          <h3>{selectedPerson.name}</h3>
          {selectedPerson.bio && <p>{selectedPerson.bio}</p>}
          {selectedPerson.occupation && <p>Occupation: {selectedPerson.occupation}</p>}
          <button onClick={() => setSelectedPerson(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default FamilyTree; 