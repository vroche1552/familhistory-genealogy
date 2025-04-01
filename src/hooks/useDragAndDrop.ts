import { useState, useCallback, useRef } from 'react';

interface DragState {
  isDragging: boolean;
  isOver: boolean;
  dragOffset: { x: number; y: number };
}

interface DragOptions {
  onDragStart?: (event: DragEvent) => void;
  onDrag?: (event: DragEvent) => void;
  onDragEnd?: (event: DragEvent) => void;
  onDragEnter?: (event: DragEvent) => void;
  onDragLeave?: (event: DragEvent) => void;
  onDragOver?: (event: DragEvent) => void;
  onDrop?: (event: DragEvent) => void;
  acceptTypes?: string[];
  disabled?: boolean;
}

export const useDragAndDrop = (options: DragOptions = {}) => {
  const {
    onDragStart,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    acceptTypes = [],
    disabled = false,
  } = options;

  const [state, setState] = useState<DragState>({
    isDragging: false,
    isOver: false,
    dragOffset: { x: 0, y: 0 },
  });

  const elementRef = useRef<HTMLElement | null>(null);
  const dragStartPosition = useRef<{ x: number; y: number } | null>(null);

  const handleDragStart = useCallback((event: DragEvent) => {
    if (disabled) return;

    event.stopPropagation();
    dragStartPosition.current = { x: event.clientX, y: event.clientY };
    setState(prev => ({ ...prev, isDragging: true }));

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      if (elementRef.current) {
        event.dataTransfer.setData('text/plain', elementRef.current.id || '');
      }
    }

    onDragStart?.(event);
  }, [disabled, onDragStart]);

  const handleDrag = useCallback((event: DragEvent) => {
    if (!state.isDragging || disabled) return;

    event.preventDefault();
    event.stopPropagation();

    if (dragStartPosition.current) {
      const offset = {
        x: event.clientX - dragStartPosition.current.x,
        y: event.clientY - dragStartPosition.current.y,
      };
      setState(prev => ({ ...prev, dragOffset: offset }));
    }

    onDrag?.(event);
  }, [state.isDragging, disabled, onDrag]);

  const handleDragEnd = useCallback((event: DragEvent) => {
    if (!state.isDragging || disabled) return;

    event.preventDefault();
    event.stopPropagation();

    dragStartPosition.current = null;
    setState(prev => ({ ...prev, isDragging: false, dragOffset: { x: 0, y: 0 } }));

    onDragEnd?.(event);
  }, [state.isDragging, disabled, onDragEnd]);

  const handleDragEnter = useCallback((event: DragEvent) => {
    if (disabled) return;

    event.preventDefault();
    event.stopPropagation();

    const types = event.dataTransfer?.types || [];
    const isAcceptedType = acceptTypes.length === 0 || acceptTypes.some(type => types.includes(type));

    if (isAcceptedType) {
      setState(prev => ({ ...prev, isOver: true }));
      onDragEnter?.(event);
    }
  }, [disabled, acceptTypes, onDragEnter]);

  const handleDragLeave = useCallback((event: DragEvent) => {
    if (disabled) return;

    event.preventDefault();
    event.stopPropagation();

    setState(prev => ({ ...prev, isOver: false }));
    onDragLeave?.(event);
  }, [disabled, onDragLeave]);

  const handleDragOver = useCallback((event: DragEvent) => {
    if (disabled) return;

    event.preventDefault();
    event.stopPropagation();

    const types = event.dataTransfer?.types || [];
    const isAcceptedType = acceptTypes.length === 0 || acceptTypes.some(type => types.includes(type));

    if (isAcceptedType) {
      event.dataTransfer!.dropEffect = 'move';
      onDragOver?.(event);
    }
  }, [disabled, acceptTypes, onDragOver]);

  const handleDrop = useCallback((event: DragEvent) => {
    if (disabled) return;

    event.preventDefault();
    event.stopPropagation();

    const types = event.dataTransfer?.types || [];
    const isAcceptedType = acceptTypes.length === 0 || acceptTypes.some(type => types.includes(type));

    if (isAcceptedType) {
      setState(prev => ({ ...prev, isOver: false }));
      onDrop?.(event);
    }
  }, [disabled, acceptTypes, onDrop]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || disabled) return;

    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('drag', handleDrag);
    element.addEventListener('dragend', handleDragEnd);
    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);

    return () => {
      element.removeEventListener('dragstart', handleDragStart);
      element.removeEventListener('drag', handleDrag);
      element.removeEventListener('dragend', handleDragEnd);
      element.removeEventListener('dragenter', handleDragEnter);
      element.removeEventListener('dragleave', handleDragLeave);
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('drop', handleDrop);
    };
  }, [
    handleDragStart,
    handleDrag,
    handleDragEnd,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    disabled,
  ]);

  return {
    elementRef,
    ...state,
  };
}; 