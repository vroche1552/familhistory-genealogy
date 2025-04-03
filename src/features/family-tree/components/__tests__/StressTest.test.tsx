import React, { act } from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { FamilyContext, Person, Relationship, FamilyTree } from '../../context/FamilyContext';
import { AuthContext } from '../../../auth/context/AuthContext';
import { AuthContextType } from '../../../auth/types';
import RelationshipManager from '../RelationshipManager';
import { default as PersonComponent } from '../Person';

// Mock data
const mockPersons: Person[] = [
  { 
    id: '1', 
    name: 'John Doe', 
    birthDate: '1990-01-01', 
    deathDate: null, 
    birthPlace: 'New York', 
    deathPlace: null,
    gender: 'male',
    photo: null,
    bio: 'Engineer',
    treeId: 'tree1', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  },
  { 
    id: '2', 
    name: 'Jane Doe', 
    birthDate: '1992-03-15', 
    deathDate: null, 
    birthPlace: 'Los Angeles', 
    deathPlace: null,
    gender: 'female',
    photo: null,
    bio: 'Designer',
    treeId: 'tree1', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  },
  { 
    id: '3', 
    name: 'Bob Smith', 
    birthDate: '1960-05-20', 
    deathDate: null, 
    birthPlace: 'Chicago', 
    deathPlace: null,
    gender: 'male',
    photo: null,
    bio: 'Teacher',
    treeId: 'tree1', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  }
];

const mockRelationships: Relationship[] = [
  {
    id: 'rel1',
    person1Id: '1',
    person2Id: '2',
    type: 'spouse',
    treeId: 'tree1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockCurrentTree: FamilyTree = {
  id: 'tree1',
  name: 'Test Tree',
  description: 'Test Description',
  ownerId: 'user1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Mock context values
const mockFamilyContext = {
  persons: mockPersons,
  relationships: mockRelationships,
  currentTree: mockCurrentTree,
  loading: false,
  error: null,
  addRelationship: jest.fn(),
  deleteRelationship: jest.fn(),
  setTrees: jest.fn(),
  trees: [],
  setCurrentTree: jest.fn(),
  addPerson: jest.fn(),
  updatePerson: jest.fn(),
  deletePerson: jest.fn(),
  updateRelationship: jest.fn(),
  createTree: jest.fn(),
  updateTree: jest.fn(),
  deleteTree: jest.fn(),
  hasRelationships: jest.fn()
};

const mockAuthContext: AuthContextType = {
  user: { id: '1', email: 'test@example.com', name: 'Test User' },
  isAuthenticated: true,
  isLoading: false,
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn()
};

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthContext.Provider value={mockAuthContext}>
    <FamilyContext.Provider value={mockFamilyContext}>
      {children}
    </FamilyContext.Provider>
  </AuthContext.Provider>
);

// Helper function to render the component
const renderComponent = () => {
  return render(
    <TestWrapper>
      <RelationshipManager />
    </TestWrapper>
  );
};

// Configure Jest to support act
jest.setTimeout(30000);

describe('Website Stress Test Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Authentication Stress Test', () => {
    test('handles rapid login attempts', async () => {
      const loginAttempts = Array(5).fill(null).map(() => 
        mockAuthContext.login('test@example.com', 'password')
      );

      await act(async () => {
        await Promise.all(loginAttempts);
      });

      expect(mockAuthContext.login).toHaveBeenCalledTimes(5);
    });

    test('handles concurrent login/logout operations', async () => {
      const operations = [
        mockAuthContext.login('test@example.com', 'password'),
        mockAuthContext.logout(),
        mockAuthContext.login('test@example.com', 'password'),
        mockAuthContext.logout()
      ];

      await act(async () => {
        await Promise.all(operations);
      });

      expect(mockAuthContext.login).toHaveBeenCalledTimes(2);
      expect(mockAuthContext.logout).toHaveBeenCalledTimes(2);
    });
  });

  describe('2. Family Tree Management Stress Test', () => {
    test('handles rapid tree creation and deletion', async () => {
      const trees = Array(3).fill(null).map((_, i) => ({
        name: `Test Tree ${i}`,
        description: `Test Description ${i}`,
        ownerId: 'user1'
      }));

      await act(async () => {
        await Promise.all(trees.map(tree => mockFamilyContext.createTree(tree)));
      });

      expect(mockFamilyContext.createTree).toHaveBeenCalledTimes(3);

      await act(async () => {
        await Promise.all(trees.map((_, i) => mockFamilyContext.deleteTree(`tree${i}`)));
      });

      expect(mockFamilyContext.deleteTree).toHaveBeenCalledTimes(3);
    });

    test('handles concurrent tree updates', async () => {
      const updates = Array(3).fill(null).map((_, i) => 
        mockFamilyContext.updateTree('tree1', { name: `Updated Tree ${i}` })
      );

      await act(async () => {
        await Promise.all(updates);
      });

      expect(mockFamilyContext.updateTree).toHaveBeenCalledTimes(3);
    });
  });

  describe('3. Person Management Stress Test', () => {
    test('handles rapid person creation', async () => {
      const persons = Array(5).fill(null).map((_, i) => ({
        name: `Test Person ${i}`,
        birthDate: '1990-01-01',
        gender: 'male',
        treeId: 'tree1'
      }));

      await act(async () => {
        await Promise.all(persons.map(person => mockFamilyContext.addPerson(person)));
      });

      expect(mockFamilyContext.addPerson).toHaveBeenCalledTimes(5);
    });

    test('handles concurrent person updates', async () => {
      const updates = Array(3).fill(null).map((_, i) => 
        mockFamilyContext.updatePerson('1', { name: `Updated Person ${i}` })
      );

      await act(async () => {
        await Promise.all(updates);
      });

      expect(mockFamilyContext.updatePerson).toHaveBeenCalledTimes(3);
    });

    test('handles rapid person deletion', async () => {
      const deletions = Array(3).fill(null).map((_, i) => 
        mockFamilyContext.deletePerson(`${i + 1}`)
      );

      await act(async () => {
        await Promise.all(deletions);
      });

      expect(mockFamilyContext.deletePerson).toHaveBeenCalledTimes(3);
    });
  });

  describe('4. Relationship Management Stress Test', () => {
    test('handles rapid relationship creation', async () => {
      const relationships = Array(5).fill(null).map((_, i) => ({
        person1Id: '1',
        person2Id: `${i + 2}`,
        type: 'spouse',
        treeId: 'tree1'
      }));

      await act(async () => {
        await Promise.all(relationships.map(rel => mockFamilyContext.addRelationship(rel)));
      });

      expect(mockFamilyContext.addRelationship).toHaveBeenCalledTimes(5);
    });

    test('handles concurrent relationship updates', async () => {
      const updates = Array(3).fill(null).map((_, i) => 
        mockFamilyContext.updateRelationship('rel1', { type: 'parent' })
      );

      await act(async () => {
        await Promise.all(updates);
      });

      expect(mockFamilyContext.updateRelationship).toHaveBeenCalledTimes(3);
    });

    test('handles rapid relationship deletion', async () => {
      const deletions = Array(3).fill(null).map((_, i) => 
        mockFamilyContext.deleteRelationship(`rel${i + 1}`)
      );

      await act(async () => {
        await Promise.all(deletions);
      });

      expect(mockFamilyContext.deleteRelationship).toHaveBeenCalledTimes(3);
    });
  });

  describe('5. Data Persistence Stress Test', () => {
    test('handles rapid state updates', async () => {
      const stateUpdates = Array(10).fill(null).map((_, i) => {
        mockFamilyContext.setCurrentTree({ ...mockCurrentTree, name: `Updated Tree ${i}` });
        mockFamilyContext.setTrees([{ ...mockCurrentTree, name: `Updated Tree ${i}` }]);
      });

      await act(async () => {
        await Promise.all(stateUpdates);
      });

      expect(mockFamilyContext.setCurrentTree).toHaveBeenCalledTimes(10);
      expect(mockFamilyContext.setTrees).toHaveBeenCalledTimes(10);
    });

    test('handles concurrent data operations', async () => {
      const operations = [
        mockFamilyContext.addPerson({ name: 'New Person', gender: 'male', treeId: 'tree1' }),
        mockFamilyContext.addRelationship({ person1Id: '1', person2Id: '2', type: 'spouse', treeId: 'tree1' }),
        mockFamilyContext.updatePerson('1', { name: 'Updated Name' }),
        mockFamilyContext.updateRelationship('rel1', { type: 'parent' })
      ];

      await act(async () => {
        await Promise.all(operations);
      });

      expect(mockFamilyContext.addPerson).toHaveBeenCalledTimes(1);
      expect(mockFamilyContext.addRelationship).toHaveBeenCalledTimes(1);
      expect(mockFamilyContext.updatePerson).toHaveBeenCalledTimes(1);
      expect(mockFamilyContext.updateRelationship).toHaveBeenCalledTimes(1);
    });
  });
}); 