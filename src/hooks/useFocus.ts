import { useEffect, useCallback, useRef } from 'react';

interface FocusOptions {
  trap?: boolean;
  initialFocus?: HTMLElement | null;
  onFocusChange?: (element: HTMLElement | null) => void;
}

export const useFocus = (options: FocusOptions = {}) => {
  const {
    trap = false,
    initialFocus,
    onFocusChange,
  } = options;

  const containerRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];

    return Array.from(
      containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];
  }, []);

  const setInitialFocus = useCallback(() => {
    if (initialFocus) {
      initialFocus.focus();
    } else {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [initialFocus, getFocusableElements]);

  const handleFocusIn = useCallback((event: FocusEvent) => {
    const target = event.target as HTMLElement;
    if (containerRef.current?.contains(target)) {
      onFocusChange?.(target);
    }
  }, [onFocusChange]);

  const handleFocusOut = useCallback((event: FocusEvent) => {
    const target = event.target as HTMLElement;
    if (containerRef.current?.contains(target)) {
      previousFocusRef.current = target;
    }
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!trap || !containerRef.current) return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    switch (event.key) {
      case 'Tab':
        if (event.shiftKey) {
          if (activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
        break;

      case 'Escape':
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
        break;
    }
  }, [trap, getFocusableElements]);

  const focusFirst = useCallback(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, [getFocusableElements]);

  const focusLast = useCallback(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }, [getFocusableElements]);

  const focusNext = useCallback(() => {
    const focusableElements = getFocusableElements();
    const activeElement = document.activeElement as HTMLElement;
    const currentIndex = focusableElements.indexOf(activeElement);

    if (currentIndex < focusableElements.length - 1) {
      focusableElements[currentIndex + 1].focus();
    }
  }, [getFocusableElements]);

  const focusPrevious = useCallback(() => {
    const focusableElements = getFocusableElements();
    const activeElement = document.activeElement as HTMLElement;
    const currentIndex = focusableElements.indexOf(activeElement);

    if (currentIndex > 0) {
      focusableElements[currentIndex - 1].focus();
    }
  }, [getFocusableElements]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('focusin', handleFocusIn);
    container.addEventListener('focusout', handleFocusOut);
    container.addEventListener('keydown', handleKeyDown);

    setInitialFocus();

    return () => {
      container.removeEventListener('focusin', handleFocusIn);
      container.removeEventListener('focusout', handleFocusOut);
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleFocusIn, handleFocusOut, handleKeyDown, setInitialFocus]);

  return {
    containerRef,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
  };
}; 