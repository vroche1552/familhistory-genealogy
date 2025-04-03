import React, { useState } from 'react';

interface TreeNode {
  name: string;
  attributes?: {
    birthDate?: string;
    deathDate?: string;
    gender?: string;
    id?: string;
    bio?: string;
  };
  children?: TreeNode[];
}

interface TreeProps {
  data: TreeNode;
  orientation?: 'horizontal' | 'vertical';
  pathFunc?: string;
  translate?: { x: number; y: number };
  renderCustomNodeElement?: (props: { nodeDatum: TreeNode; toggleNode: () => void }) => React.ReactNode;
  onUpdate?: (id: string, data: { name: string }) => void;
  relationships?: Array<{ id: string; person1Id: string; person2Id: string; type: string }>;
}

const Tree: React.FC<TreeProps> = ({ data, orientation = 'vertical', pathFunc = 'step', translate = { x: 0, y: 0 }, renderCustomNodeElement, onUpdate, relationships = [] }) => {
  const [transform, setTransform] = useState({ x: translate.x, y: translate.y, k: 1 });
  const [selectedPerson, setSelectedPerson] = useState<TreeNode | null>(null);
  const [editedName, setEditedName] = useState('');

  const handlePersonClick = (node: TreeNode) => {
    setSelectedPerson(node);
    setEditedName(node.name);
  };

  const handleSavePerson = () => {
    if (selectedPerson && onUpdate) {
      onUpdate(selectedPerson.attributes?.id || '', { name: editedName });
    }
  };

  const renderNode = (node: TreeNode) => {
    const nodeId = node.attributes?.id || '';
    return (
      <g data-testid={`person-${nodeId}`} onClick={() => handlePersonClick(node)}>
        <circle
          r={10}
          fill={node.children ? '#4F46E5' : '#6B7280'}
          stroke="#1F2937"
          strokeWidth="2"
        />
        <text
          dy=".31em"
          x={node.children ? -12 : 12}
          textAnchor={node.children ? 'end' : 'start'}
          style={{ fill: '#1F2937', fontSize: '14px' }}
        >
          {node.name}
        </text>
        {node.attributes && (
          <text
            dy="1.5em"
            x={node.children ? -12 : 12}
            textAnchor={node.children ? 'end' : 'start'}
            style={{ fill: '#6B7280', fontSize: '12px' }}
          >
            {node.attributes.birthDate || 'Unknown'}
          </text>
        )}
      </g>
    );
  };

  const renderTree = (node: TreeNode) => {
    return (
      <g>
        {renderNode(node)}
        {node.children && node.children.map((child, index) => {
          const relationship = relationships.find(r => 
            r.person1Id === node.attributes?.id && r.person2Id === child.attributes?.id
          );
          return (
            <g key={index}>
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={50}
                stroke="#1F2937"
                strokeWidth="2"
                data-testid={`relationship-${relationship?.id || ''}`}
                data-relationship-type="parent"
              />
              <g transform={`translate(0, 50)`} data-testid={`drop-zone-${child.attributes?.id || ''}`}>
                {renderTree(child)}
              </g>
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <svg width="100%" height="100%">
      <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
        {renderTree(data)}
      </g>
    </svg>
  );
};

export default Tree;