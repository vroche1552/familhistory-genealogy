import { useState, useCallback } from 'react';

type SortDirection = 'asc' | 'desc';

interface SortingState<T> {
  sortField: keyof T | null;
  sortDirection: SortDirection;
  isLoading: boolean;
  error: string | null;
}

interface SortingOptions<T> {
  initialSortField?: keyof T;
  initialSortDirection?: SortDirection;
}

export const useSorting = <T extends Record<string, any>>(options: SortingOptions<T> = {}) => {
  const [state, setState] = useState<SortingState<T>>({
    sortField: options.initialSortField || null,
    sortDirection: options.initialSortDirection || 'asc',
    isLoading: false,
    error: null,
  });

  const setSortField = useCallback((field: keyof T) => {
    setState(prev => ({
      ...prev,
      sortField: field,
      // If clicking the same field, toggle direction
      sortDirection: prev.sortField === field && prev.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const setSortDirection = useCallback((direction: SortDirection) => {
    setState(prev => ({
      ...prev,
      sortDirection: direction,
    }));
  }, []);

  const clearSorting = useCallback(() => {
    setState(prev => ({
      ...prev,
      sortField: null,
      sortDirection: 'asc',
    }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading,
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({
      ...prev,
      error,
    }));
  }, []);

  return {
    ...state,
    setSortField,
    setSortDirection,
    clearSorting,
    setLoading,
    setError,
  };
}; 