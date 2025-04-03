import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { act as reactAct } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import Person from '../Person';
import { Person as PersonType } from '../../types';
import { useFamily } from '../../context/FamilyContext';

// Mock window.alert
const mockAlert = jest.fn();
window.alert = mockAlert;

// Mock TinyMCE Editor
jest.mock('@tinymce/tinymce-react', () => {
  return {
    Editor: ({ value, onEditorChange }: any) => (
      <textarea
        data-testid="tinymce-editor"
        value={value}
        onChange={(e) => onEditorChange(e.target.value)}
      />
    ),
  };
});

// Mock FamilyContext
jest.mock('../../context/FamilyContext', () => ({
  useFamily: jest.fn(),
}));

describe('Person', () => {
  const mockPerson: PersonType = {
    id: '1',
    name: 'John Doe',
    treeId: 'tree1',
    birthDate: '1990-01-01',
    deathDate: null,
    gender: 'male',
    occupation: 'Engineer',
    birthPlace: 'New York',
    deathPlace: null,
    notes: 'Test notes',
    bio: 'Test bio',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();
  const mockHasRelationships = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useFamily as jest.Mock).mockReturnValue({
      hasRelationships: mockHasRelationships,
    });
  });

  test('renders person information correctly', () => {
    render(<Person person={mockPerson} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('Test notes')).toBeInTheDocument();
    expect(screen.getByText('Test bio')).toBeInTheDocument();
  });

  test('enters edit mode when edit button is clicked', async () => {
    render(<Person person={mockPerson} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    
    await act(async () => {
      fireEvent.click(screen.getByText('Edit'));
    });

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Occupation')).toBeInTheDocument();
    expect(screen.getByLabelText('Birth Place')).toBeInTheDocument();
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
    expect(screen.getByTestId('tinymce-editor')).toBeInTheDocument();
  });

  test('updates person information when save is clicked', async () => {
    render(<Person person={mockPerson} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    
    // Enter edit mode
    await act(async () => {
      fireEvent.click(screen.getByText('Edit'));
    });

    // Update fields
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Doe' } });
      fireEvent.change(screen.getByLabelText('Occupation'), { target: { value: 'Doctor' } });
      fireEvent.change(screen.getByLabelText('Birth Place'), { target: { value: 'Boston' } });
      fireEvent.change(screen.getByLabelText('Notes'), { target: { value: 'Updated notes' } });
      fireEvent.change(screen.getByTestId('tinymce-editor'), { target: { value: 'Updated bio' } });
    });

    // Save changes
    await act(async () => {
      fireEvent.click(screen.getByText('Save'));
    });

    expect(mockOnUpdate).toHaveBeenCalledWith('1', {
      name: 'Jane Doe',
      occupation: 'Doctor',
      birthPlace: 'Boston',
      notes: 'Updated notes',
      bio: 'Updated bio',
    });
  });

  test('cancels edit mode when cancel is clicked', async () => {
    render(<Person person={mockPerson} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    
    // Enter edit mode
    await act(async () => {
      fireEvent.click(screen.getByText('Edit'));
    });

    // Cancel edit
    await act(async () => {
      fireEvent.click(screen.getByText('Cancel'));
    });

    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Occupation')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Birth Place')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Notes')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tinymce-editor')).not.toBeInTheDocument();
  });

  test('handles errors when update fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockOnUpdate.mockRejectedValueOnce(new Error('Update failed'));

    render(<Person person={mockPerson} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    
    // Enter edit mode
    await act(async () => {
      fireEvent.click(screen.getByText('Edit'));
    });

    // Save changes
    await act(async () => {
      fireEvent.click(screen.getByText('Save'));
    });

    expect(consoleError).toHaveBeenCalledWith('Failed to update person:', expect.any(Error));
    consoleError.mockRestore();
  });

  test('shows delete confirmation dialog when delete is clicked', async () => {
    render(<Person person={mockPerson} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    
    await act(async () => {
      fireEvent.click(screen.getByText('Delete'));
    });

    expect(screen.getByText('Are you sure you want to delete this person?')).toBeInTheDocument();
  });

  test('handles successful person deletion', async () => {
    mockHasRelationships.mockReturnValue(false);
    render(<Person person={mockPerson} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    
    // Show delete confirmation
    await act(async () => {
      fireEvent.click(screen.getByText('Delete'));
    });

    // Confirm deletion
    await act(async () => {
      fireEvent.click(screen.getByText('Confirm Delete'));
    });

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  test('handles errors when deletion fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockOnDelete.mockRejectedValueOnce(new Error('Delete failed'));
    mockHasRelationships.mockReturnValue(false);

    render(<Person person={mockPerson} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    
    // Show delete confirmation
    await act(async () => {
      fireEvent.click(screen.getByText('Delete'));
    });

    // Confirm deletion
    await act(async () => {
      fireEvent.click(screen.getByText('Confirm Delete'));
    });

    expect(consoleError).toHaveBeenCalledWith('Failed to delete person:', expect.any(Error));
    consoleError.mockRestore();
  });

  test('prevents deletion when person has relationships', async () => {
    mockHasRelationships.mockReturnValue(true);
    render(<Person person={mockPerson} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    
    // Show delete confirmation
    await act(async () => {
      fireEvent.click(screen.getByText('Delete'));
    });

    // Confirm deletion
    await act(async () => {
      fireEvent.click(screen.getByText('Confirm Delete'));
    });

    expect(mockAlert).toHaveBeenCalledWith('Cannot delete person with existing relationships. Please delete all relationships first.');
    expect(mockOnDelete).not.toHaveBeenCalled();
  });
}); 