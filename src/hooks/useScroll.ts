import { useState, useEffect, useCallback, useRef } from 'react';

interface ScrollState {
  x: number;
  y: number;
  direction: 'up' | 'down' | null;
  isScrolling: boolean;
  isAtTop: boolean;
  isAtBottom: boolean;
}

interface ScrollOptions {
  throttle?: number;
  onScroll?: (state: ScrollState) => void;
  onScrollStart?: () => void;
  onScrollEnd?: () => void;
  onReachTop?: () => void;
  onReachBottom?: () => void;
}

export const useScroll = (options: ScrollOptions = {}) => {
  const {
    throttle = 100,
    onScroll,
    onScrollStart,
    onScrollEnd,
    onReachTop,
    onReachBottom,
  } = options;

  const [state, setState] = useState<ScrollState>({
    x: window.scrollX,
    y: window.scrollY,
    direction: null,
    isScrolling: false,
    isAtTop: window.scrollY === 0,
    isAtBottom: window.scrollY + window.innerHeight >= document.documentElement.scrollHeight,
  });

  const lastScrollY = useRef(window.scrollY);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const isScrolling = useRef(false);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const direction = currentScrollY > lastScrollY.current ? 'down' : 'up';
    const isAtTop = currentScrollY === 0;
    const isAtBottom = currentScrollY + window.innerHeight >= document.documentElement.scrollHeight;

    setState(prev => ({
      x: window.scrollX,
      y: currentScrollY,
      direction,
      isScrolling: true,
      isAtTop,
      isAtBottom,
    }));

    lastScrollY.current = currentScrollY;

    if (onScroll) {
      onScroll({
        x: window.scrollX,
        y: currentScrollY,
        direction,
        isScrolling: true,
        isAtTop,
        isAtBottom,
      });
    }

    if (isAtTop && onReachTop) {
      onReachTop();
    }

    if (isAtBottom && onReachBottom) {
      onReachBottom();
    }

    if (!isScrolling.current) {
      isScrolling.current = true;
      onScrollStart?.();
    }

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      isScrolling.current = false;
      setState(prev => ({
        ...prev,
        isScrolling: false,
      }));
      onScrollEnd?.();
    }, throttle);
  }, [throttle, onScroll, onScrollStart, onScrollEnd, onReachTop, onReachBottom]);

  const scrollTo = useCallback((x: number, y: number, behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({
      left: x,
      top: y,
      behavior,
    });
  }, []);

  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    scrollTo(0, 0, behavior);
  }, [scrollTo]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    scrollTo(0, document.documentElement.scrollHeight, behavior);
  }, [scrollTo]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [handleScroll]);

  return {
    ...state,
    scrollTo,
    scrollToTop,
    scrollToBottom,
  };
}; 