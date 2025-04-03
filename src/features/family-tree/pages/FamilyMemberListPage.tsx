import React from 'react';
import FamilyMemberList from '../components/FamilyMemberList';

const FamilyMemberListPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Family Members</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <FamilyMemberList />
      </div>
    </div>
  );
};

export default FamilyMemberListPage; 