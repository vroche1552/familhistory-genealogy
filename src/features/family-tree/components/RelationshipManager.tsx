import React, { useState } from 'react';
import { useFamily } from '../context/FamilyContext';
import { Person, Relationship } from '../types';

type RelationshipType = 'parent' | 'spouse' | 'sibling';

const RelationshipManager: React.FC = () => {
  const { persons, relationships, addRelationship, deleteRelationship, loading, error, currentTree } = useFamily();
  const [person1Id, setPerson1Id] = useState('');
  const [person2Id, setPerson2Id] = useState('');
  const [type, setType] = useState<RelationshipType>('parent');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!person1Id || !person2Id || !currentTree) return;

    // Check for duplicate relationships
    const isDuplicate = relationships.some(
      (rel) =>
        (rel.person1Id === person1Id && rel.person2Id === person2Id && rel.type === type) ||
        (rel.person1Id === person2Id && rel.person2Id === person1Id && rel.type === type)
    );

    if (isDuplicate) {
      setFormError('This relationship already exists');
      return;
    }

    await addRelationship({
      person1Id,
      person2Id,
      type,
      treeId: currentTree.id,
    });

    // Reset form
    setPerson1Id('');
    setPerson2Id('');
    setType('parent');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this relationship?')) {
      await deleteRelationship(id);
    }
  };

  const getPersonName = (id: string): string => {
    return persons.find(p => p.id === id)?.name || 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div 
          role="status"
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
          aria-label="Loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4" role="alert">
        Error loading relationships: {error}
      </div>
    );
  }

  if (!currentTree) {
    return (
      <div className="text-gray-500 p-4" role="alert">
        Please select a family tree first
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Relationship Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Relationship</h2>
        {formError && (
          <div className="mb-4 text-red-500" role="alert">
            {formError}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label 
              htmlFor="person1"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Person 1
            </label>
            <select
              id="person1"
              value={person1Id}
              onChange={(e) => setPerson1Id(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
              aria-label="Select first person"
            >
              <option value="">Select a person</option>
              {persons.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label 
              htmlFor="relationshipType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Relationship Type
            </label>
            <select
              id="relationshipType"
              value={type}
              onChange={(e) => setType(e.target.value as RelationshipType)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
              aria-label="Select relationship type"
            >
              <option value="parent">Parent</option>
              <option value="spouse">Spouse</option>
              <option value="sibling">Sibling</option>
            </select>
          </div>
          <div>
            <label 
              htmlFor="person2"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Person 2
            </label>
            <select
              id="person2"
              value={person2Id}
              onChange={(e) => setPerson2Id(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
              aria-label="Select second person"
            >
              <option value="">Select a person</option>
              {persons
                .filter((person) => person.id !== person1Id)
                .map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Add Relationship
          </button>
        </div>
      </form>

      {/* Relationships List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing Relationships</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200" role="grid">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Person 1
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Person 2
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {relationships.map((relationship) => (
                <tr key={relationship.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getPersonName(relationship.person1Id)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 capitalize">
                      {relationship.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getPersonName(relationship.person2Id)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(relationship.id)}
                      className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      aria-label={`Delete relationship between ${getPersonName(relationship.person1Id)} and ${getPersonName(relationship.person2Id)}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RelationshipManager; 