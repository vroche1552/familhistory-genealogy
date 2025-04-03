import React, { act } from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import RelationshipManager from '../RelationshipManager';
import { FamilyContext, Person, Relationship, FamilyTree } from '../../context/FamilyContext';
import { AuthContext } from '../../../auth/context/AuthContext';
import { AuthContextType } from '../../../auth/types';

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

describe('RelationshipManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Component renders correctly
  test('renders relationship manager with form and table', async () => {
    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(screen.getByText('Add New Relationship')).toBeInTheDocument();
      expect(screen.getByText('Existing Relationships')).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  // Test 2: Form validation
  test('validates form fields', async () => {
    await act(async () => {
      renderComponent();
    });

    const submitButton = screen.getByText('Add Relationship');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockFamilyContext.addRelationship).not.toHaveBeenCalled();
    }, { timeout: 10000 });
  });

  // Test 3: Person selection filtering
  test('person 2 dropdown excludes selected person 1', async () => {
    await act(async () => {
      renderComponent();
    });

    await act(async () => {
      const person1Select = screen.getByLabelText('Select first person');
      fireEvent.change(person1Select, { target: { value: '1' } });
    });

    await waitFor(() => {
      const person2Select = screen.getByLabelText('Select second person');
      const person2Options = within(person2Select).getAllByRole('option');
      expect(person2Options).toHaveLength(3); // Placeholder + Jane Doe + Bob Smith
      expect(person2Options[0]).toHaveValue('');
      expect(person2Options[1]).toHaveValue('2');
      expect(person2Options[2]).toHaveValue('3');
      expect(person2Options[0]).toHaveTextContent('Select a person');
      expect(person2Options[1]).toHaveTextContent('Jane Doe');
      expect(person2Options[2]).toHaveTextContent('Bob Smith');
    }, { timeout: 10000 });
  }, 30000);

  // Test 4: Relationship type selection
  test('allows selecting relationship type', async () => {
    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      const typeSelect = screen.getByLabelText('Select relationship type');
      const options = within(typeSelect).getAllByRole('option');
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveValue('parent');
      expect(options[1]).toHaveValue('spouse');
      expect(options[2]).toHaveValue('sibling');
    }, { timeout: 10000 });
  });

  // Test 5: Form submission
  test('submits new relationship successfully', async () => {
    await act(async () => {
      renderComponent();
    });

    await act(async () => {
      // Fill form
      const person1Select = screen.getByLabelText('Select first person');
      const person2Select = screen.getByLabelText('Select second person');
      const typeSelect = screen.getByLabelText('Select relationship type');

      fireEvent.change(person1Select, { target: { value: '1' } });
      fireEvent.change(person2Select, { target: { value: '2' } });
      fireEvent.change(typeSelect, { target: { value: 'parent' } });
    });

    const submitButton = screen.getByText('Add Relationship');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockFamilyContext.addRelationship).toHaveBeenCalledWith({
        person1Id: '1',
        person2Id: '2',
        type: 'parent',
        treeId: 'tree1'
      });
    }, { timeout: 10000 });
  });

  // Test 6: Duplicate relationship prevention
  test('prevents creating duplicate relationships', async () => {
    await act(async () => {
      renderComponent();
    });

    await act(async () => {
      // Fill form with existing relationship
      const person1Select = screen.getByLabelText('Select first person');
      const person2Select = screen.getByLabelText('Select second person');
      const typeSelect = screen.getByLabelText('Select relationship type');

      fireEvent.change(person1Select, { target: { value: '1' } });
      fireEvent.change(person2Select, { target: { value: '2' } });
      fireEvent.change(typeSelect, { target: { value: 'spouse' } });
    });

    const submitButton = screen.getByText('Add Relationship');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('This relationship already exists')).toBeInTheDocument();
      expect(mockFamilyContext.addRelationship).not.toHaveBeenCalled();
    }, { timeout: 10000 });
  });

  // Test 7: Relationship deletion
  test('deletes relationship with confirmation', async () => {
    window.confirm = jest.fn(() => true);
    await act(async () => {
      renderComponent();
    });

    await act(async () => {
      const deleteButton = screen.getByRole('button', { 
        name: /delete relationship between john doe and jane doe/i 
      });
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this relationship?');
      expect(mockFamilyContext.deleteRelationship).toHaveBeenCalledWith('rel1');
    }, { timeout: 10000 });
  });
}); 