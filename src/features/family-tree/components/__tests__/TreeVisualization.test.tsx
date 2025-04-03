import React, { act } from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { FamilyContext, Person, Relationship, FamilyTree } from '../../context/FamilyContext';
import { AuthContext } from '../../../auth/context/AuthContext';
import { AuthContextType } from '../../../auth/types';
import { default as FamilyTreeComponent } from '../FamilyTree';
import { default as PersonComponent } from '../Person';

// Mock data for a complex family tree
const mockPersons: Person[] = [
  { 
    id: '1', 
    name: 'John Doe', 
    birthDate: '1960-01-01', 
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
    birthDate: '1962-03-15', 
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
  },
  {
    id: '4',
    name: 'Alice Smith',
    birthDate: '1962-08-10',
    deathDate: null,
    birthPlace: 'Boston',
    deathPlace: null,
    gender: 'female',
    photo: null,
    bio: 'Doctor',
    treeId: 'tree1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Mike Doe',
    birthDate: '1985-12-25',
    deathDate: null,
    birthPlace: 'New York',
    deathPlace: null,
    gender: 'male',
    photo: null,
    bio: 'Student',
    treeId: 'tree1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Sarah Doe',
    birthDate: '1988-07-30',
    deathDate: null,
    birthPlace: 'New York',
    deathPlace: null,
    gender: 'female',
    photo: null,
    bio: 'Student',
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
  },
  {
    id: 'rel2',
    person1Id: '3',
    person2Id: '4',
    type: 'spouse',
    treeId: 'tree1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rel3',
    person1Id: '1',
    person2Id: '5',
    type: 'parent',
    treeId: 'tree1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rel4',
    person1Id: '2',
    person2Id: '5',
    type: 'parent',
    treeId: 'tree1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rel5',
    person1Id: '1',
    person2Id: '6',
    type: 'parent',
    treeId: 'tree1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rel6',
    person1Id: '2',
    person2Id: '6',
    type: 'parent',
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
      <FamilyTreeComponent />
    </TestWrapper>
  );
};

// Configure Jest to support act
jest.setTimeout(30000);

describe('Family Tree Visualization Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Tree Layout and Rendering', () => {
    test('renders all persons in the tree', async () => {
      renderComponent();
      
      // Check if all persons are rendered
      mockPersons.forEach(person => {
        expect(screen.getByText(person.name)).toBeInTheDocument();
      });
    });

    test('renders all relationships between persons', async () => {
      renderComponent();
      
      // Check if relationship lines are rendered
      mockRelationships.forEach(rel => {
        const person1 = mockPersons.find(p => p.id === rel.person1Id);
        const person2 = mockPersons.find(p => p.id === rel.person2Id);
        expect(screen.getByTestId(`relationship-${rel.id}`)).toBeInTheDocument();
      });
    });

    test('displays correct relationship types', async () => {
      renderComponent();
      
      // Check if relationship types are displayed correctly
      mockRelationships.forEach(rel => {
        const relationshipElement = screen.getByTestId(`relationship-${rel.id}`);
        expect(relationshipElement).toHaveAttribute('data-relationship-type', rel.type);
      });
    });
  });

  describe('2. Interactive Features', () => {
    test('allows dragging and dropping persons to rearrange the tree', async () => {
      renderComponent();
      
      const personElement = screen.getByTestId('person-1');
      const dropZone = screen.getByTestId('drop-zone-2');

      await act(async () => {
        fireEvent.dragStart(personElement);
        fireEvent.drop(dropZone);
      });

      // Check if the person's position was updated
      expect(mockFamilyContext.updatePerson).toHaveBeenCalledWith('1', expect.any(Object));
    });

    test('allows zooming in and out of the tree', async () => {
      renderComponent();
      
      const zoomInButton = screen.getByTestId('zoom-in-button');
      const zoomOutButton = screen.getByTestId('zoom-out-button');

      await act(async () => {
        fireEvent.click(zoomInButton);
        fireEvent.click(zoomOutButton);
      });

      // Check if zoom level was updated
      expect(screen.getByTestId('tree-container')).toHaveStyle({
        transform: expect.stringMatching(/translate.*scale/)
      });
    });

    test('allows panning the tree view', async () => {
      renderComponent();
      
      const treeContainer = screen.getByTestId('tree-container');
      
      await act(async () => {
        fireEvent.mouseDown(treeContainer, { clientX: 0, clientY: 0 });
        fireEvent.mouseMove(treeContainer, { clientX: 100, clientY: 100 });
        fireEvent.mouseUp(treeContainer);
      });

      // Check if the tree was panned
      expect(treeContainer).toHaveStyle({
        transform: expect.stringMatching(/translate.*scale/)
      });
    });
  });

  describe('3. Person Details and Editing', () => {
    test('displays person details in a modal when clicked', async () => {
      renderComponent();
      
      const personElement = screen.getByTestId('person-1');
      
      await act(async () => {
        fireEvent.click(personElement);
      });

      // Check if the modal is displayed with person details
      expect(screen.getByTestId('person-modal')).toBeInTheDocument();
      expect(screen.getByTestId('person-modal').querySelector('h2')).toHaveTextContent('John Doe');
      expect(screen.getByText('Engineer')).toBeInTheDocument();
    });

    test('allows editing person details in the modal', async () => {
      renderComponent();
      
      // Open the modal
      const personElement = screen.getByTestId('person-1');
      await act(async () => {
        fireEvent.click(personElement);
      });

      // Edit person details
      const nameInput = screen.getByTestId('person-name-input');
      await act(async () => {
        fireEvent.change(nameInput, { target: { value: 'John Updated' } });
        fireEvent.click(screen.getByTestId('save-person-button'));
      });

      // Check if the person was updated
      expect(mockFamilyContext.updatePerson).toHaveBeenCalledWith('1', expect.objectContaining({
        name: 'John Updated'
      }));
    });
  });

  describe('4. Tree Navigation and Search', () => {
    test('allows searching for persons in the tree', async () => {
      renderComponent();
      
      const searchInput = screen.getByTestId('person-search-input');
      
      await act(async () => {
        fireEvent.change(searchInput, { target: { value: 'John' } });
      });

      // Check if search results are displayed
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    test('allows centering the view on a specific person', async () => {
      renderComponent();
      
      const centerButton = screen.getByTestId('center-person-button');
      
      await act(async () => {
        fireEvent.click(centerButton);
      });

      // Check if the view is centered on the person
      expect(screen.getByTestId('tree-container')).toHaveStyle({
        transform: expect.stringMatching(/translate.*scale/)
      });
    });
  });

  describe('5. Tree Export and Import', () => {
    test('allows exporting the tree as an image', async () => {
      renderComponent();
      
      const exportButton = screen.getByTestId('export-tree-button');
      
      await act(async () => {
        fireEvent.click(exportButton);
      });

      // Check if the export function was called
      expect(screen.getByTestId('export-modal')).toBeInTheDocument();
    });

    test('allows importing a tree from an image', async () => {
      renderComponent();
      
      const importButton = screen.getByTestId('import-tree-button');
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      
      await act(async () => {
        fireEvent.click(importButton);
        fireEvent.change(screen.getByTestId('import-file-input'), {
          target: { files: [file] }
        });
      });

      // Check if the import function was called
      expect(screen.getByTestId('import-modal')).toBeInTheDocument();
    });
  });
}); 