import React, { useState } from 'react';
import { useFamily } from '../context/FamilyContext';
import { Person as PersonType } from '../types';
import { Editor } from '@tinymce/tinymce-react';

interface PersonProps {
  person: PersonType;
  onUpdate?: (id: string, updates: Partial<PersonType>) => void;
  onDelete?: (id: string) => void;
}

const Person: React.FC<PersonProps> = ({ person, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPerson, setEditedPerson] = useState(person);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { hasRelationships } = useFamily();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await onUpdate?.(person.id, {
        name: editedPerson.name,
        occupation: editedPerson.occupation,
        birthPlace: editedPerson.birthPlace,
        notes: editedPerson.notes,
        bio: editedPerson.bio
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update person:', error);
    }
  };

  const handleCancel = () => {
    setEditedPerson(person);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedPerson(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBioChange = (content: string) => {
    setEditedPerson(prev => ({
      ...prev,
      bio: content
    }));
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (hasRelationships(person.id)) {
        alert('Cannot delete person with existing relationships. Please delete all relationships first.');
        return;
      }

      await onDelete?.(person.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete person:', error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  if (isEditing) {
    return (
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedPerson.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
              Occupation
            </label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              value={editedPerson.occupation || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700">
              Birth Place
            </label>
            <input
              type="text"
              id="birthPlace"
              name="birthPlace"
              value={editedPerson.birthPlace || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={editedPerson.notes || ''}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Biography
            </label>
            <Editor
              apiKey="6nrq2j2r00k971tlxvqk3lxkjpsxq4vwnzmvyua86ei2p7vz"
              value={editedPerson.bio || ''}
              onEditorChange={handleBioChange}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showDeleteConfirm) {
    return (
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this person?
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleDeleteCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{person.name}</h3>
          {person.occupation && (
            <div className="mt-1 text-sm text-gray-600">{person.occupation}</div>
          )}
          {person.birthPlace && (
            <div className="mt-1 text-sm text-gray-600">{person.birthPlace}</div>
          )}
          {person.notes && (
            <div className="mt-2 text-sm text-gray-600">{person.notes}</div>
          )}
          {person.bio && (
            <div 
              className="mt-2 text-sm text-gray-600"
              dangerouslySetInnerHTML={{ __html: person.bio }}
            />
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="text-primary hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteClick}
            className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Person; 