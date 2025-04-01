import { useState, useCallback } from 'react';

interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  isLoading: boolean;
  error: string | null;
}

interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
}

export const usePagination = (options: PaginationOptions = {}) => {
  const [state, setState] = useState<PaginationState>({
    currentPage: options.initialPage || 1,
    totalPages: 1,
    pageSize: options.initialPageSize || 10,
    totalItems: 0,
    isLoading: false,
    error: null,
  });

  const setPage = useCallback((page: number) => {
    setState(prev => ({
      ...prev,
      currentPage: Math.max(1, Math.min(page, prev.totalPages)),
    }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setState(prev => ({
      ...prev,
      pageSize,
      currentPage: 1, // Reset to first page when changing page size
    }));
  }, []);

  const updateTotalItems = useCallback((totalItems: number) => {
    setState(prev => ({
      ...prev,
      totalItems,
      totalPages: Math.ceil(totalItems / prev.pageSize),
    }));
  }, []);

  const nextPage = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPage: Math.min(prev.currentPage + 1, prev.totalPages),
    }));
  }, []);

  const previousPage = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPage: Math.max(prev.currentPage - 1, 1),
    }));
  }, []);

  const goToFirstPage = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPage: 1,
    }));
  }, []);

  const goToLastPage = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPage: prev.totalPages,
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
    setPage,
    setPageSize,
    updateTotalItems,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    setLoading,
    setError,
  };
}; 