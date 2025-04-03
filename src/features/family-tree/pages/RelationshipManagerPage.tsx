import React from 'react';
import RelationshipManager from '../components/RelationshipManager';

const RelationshipManagerPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Manage Relationships</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <RelationshipManager />
      </div>
    </div>
  );
};

export default RelationshipManagerPage; 