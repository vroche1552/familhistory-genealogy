import React from 'react';
import FamilyTree from '../components/FamilyTree';

const FamilyTreePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Family Tree</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <FamilyTree />
      </div>
    </div>
  );
};

export default FamilyTreePage; 