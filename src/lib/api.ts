import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Person, FamilyTree, Document, GedcomData } from '@/types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  tagTypes: ['Person', 'FamilyTree', 'Document'],
  endpoints: (builder) => ({
    // Person endpoints
    getPerson: builder.query<Person, string>({
      query: (id) => `persons/${id}`,
      providesTags: (result, error, id) => [{ type: 'Person', id }],
    }),
    updatePerson: builder.mutation<Person, { id: string; data: Partial<Person> }>({
      query: ({ id, data }) => ({
        url: `persons/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Person', id }],
    }),
    createPerson: builder.mutation<Person, Omit<Person, 'id'>>({
      query: (data) => ({
        url: 'persons',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Person'],
    }),

    // Family Tree endpoints
    getFamilyTree: builder.query<FamilyTree, string>({
      query: (id) => `family-trees/${id}`,
      providesTags: (result, error, id) => [{ type: 'FamilyTree', id }],
    }),
    createFamilyTree: builder.mutation<FamilyTree, Omit<FamilyTree, 'id'>>({
      query: (data) => ({
        url: 'family-trees',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FamilyTree'],
    }),

    // Document endpoints
    uploadDocument: builder.mutation<Document, { personId: string; file: File }>({
      query: ({ personId, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `persons/${personId}/documents`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { personId }) => [{ type: 'Person', id: personId }],
    }),
    processDocument: builder.mutation<Document, { personId: string; documentId: string }>({
      query: ({ personId, documentId }) => ({
        url: `persons/${personId}/documents/${documentId}/process`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { personId }) => [{ type: 'Person', id: personId }],
    }),

    // GEDCOM import
    importGedcom: builder.mutation<FamilyTree, { file: File }>({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: 'import/gedcom',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['FamilyTree'],
    }),
  }),
});

export const {
  useGetPersonQuery,
  useUpdatePersonMutation,
  useCreatePersonMutation,
  useGetFamilyTreeQuery,
  useCreateFamilyTreeMutation,
  useUploadDocumentMutation,
  useProcessDocumentMutation,
  useImportGedcomMutation,
} = api;

export const importGedcom = async (file: File): Promise<FamilyTree> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/import/gedcom', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to import GEDCOM file');
  }

  return response.json();
}; 