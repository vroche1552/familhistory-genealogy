import { useEffect, useCallback } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  handler: KeyHandler;
  description?: string;
}

interface ShortcutOptions {
  shortcuts: Shortcut[];
  enabled?: boolean;
}

export const useKeyboardShortcuts = (options: ShortcutOptions) => {
  const { shortcuts, enabled = true } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    shortcuts.forEach(shortcut => {
      const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const matchesCtrl = !shortcut.ctrlKey || event.ctrlKey;
      const matchesShift = !shortcut.shiftKey || event.shiftKey;
      const matchesAlt = !shortcut.altKey || event.altKey;
      const matchesMeta = !shortcut.metaKey || event.metaKey;

      if (matchesKey && matchesCtrl && matchesShift && matchesAlt && matchesMeta) {
        event.preventDefault();
        shortcut.handler(event);
      }
    });
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);

  const getShortcutDescription = useCallback((shortcut: Shortcut) => {
    const parts = [];
    
    if (shortcut.ctrlKey) parts.push('Ctrl');
    if (shortcut.shiftKey) parts.push('Shift');
    if (shortcut.altKey) parts.push('Alt');
    if (shortcut.metaKey) parts.push('Meta');
    
    parts.push(shortcut.key.toUpperCase());
    
    return parts.join(' + ');
  }, []);

  return {
    getShortcutDescription,
  };
}; 