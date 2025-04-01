import { useState, useCallback } from 'react';

type FilterValue = string | number | boolean | null | undefined;
type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between' | 'in';

interface Filter<T> {
  field: keyof T;
  operator: FilterOperator;
  value: FilterValue | FilterValue[];
}

interface FilteringState<T> {
  filters: Filter<T>[];
  isLoading: boolean;
  error: string | null;
}

interface FilteringOptions<T> {
  initialFilters?: Filter<T>[];
}

export const useFiltering = <T extends Record<string, any>>(options: FilteringOptions<T> = {}) => {
  const [state, setState] = useState<FilteringState<T>>({
    filters: options.initialFilters || [],
    isLoading: false,
    error: null,
  });

  const addFilter = useCallback((filter: Filter<T>) => {
    setState(prev => ({
      ...prev,
      filters: [...prev.filters, filter],
    }));
  }, []);

  const removeFilter = useCallback((field: keyof T) => {
    setState(prev => ({
      ...prev,
      filters: prev.filters.filter(f => f.field !== field),
    }));
  }, []);

  const updateFilter = useCallback((field: keyof T, updates: Partial<Filter<T>>) => {
    setState(prev => ({
      ...prev,
      filters: prev.filters.map(f =>
        f.field === field ? { ...f, ...updates } : f
      ),
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: [],
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
    addFilter,
    removeFilter,
    updateFilter,
    clearFilters,
    setLoading,
    setError,
  };
}; 