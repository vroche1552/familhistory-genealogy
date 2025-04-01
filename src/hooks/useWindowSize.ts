import { useState, useEffect, useCallback, useRef } from 'react';

interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
}

interface Breakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
}

const DEFAULT_BREAKPOINTS: Breakpoints = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
};

interface WindowSizeOptions {
  breakpoints?: Breakpoints;
  debounce?: number;
  onResize?: (size: WindowSize) => void;
}

export const useWindowSize = (options: WindowSizeOptions = {}) => {
  const {
    breakpoints = DEFAULT_BREAKPOINTS,
    debounce = 250,
    onResize,
  } = options;

  const [size, setSize] = useState<WindowSize>(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return {
      width,
      height,
      isMobile: width < breakpoints.mobile,
      isTablet: width >= breakpoints.mobile && width < breakpoints.tablet,
      isDesktop: width >= breakpoints.tablet,
      isLandscape: width > height,
      isPortrait: width <= height,
    };
  });

  const resizeTimeout = useRef<NodeJS.Timeout>();

  const handleResize = useCallback(() => {
    if (resizeTimeout.current) {
      clearTimeout(resizeTimeout.current);
    }

    resizeTimeout.current = setTimeout(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const newSize = {
        width,
        height,
        isMobile: width < breakpoints.mobile,
        isTablet: width >= breakpoints.mobile && width < breakpoints.tablet,
        isDesktop: width >= breakpoints.tablet,
        isLandscape: width > height,
        isPortrait: width <= height,
      };

      setSize(newSize);
      onResize?.(newSize);
    }, debounce);
  }, [breakpoints, debounce, onResize]);

  const getBreakpoint = useCallback((width: number) => {
    if (width < breakpoints.mobile) return 'mobile';
    if (width < breakpoints.tablet) return 'tablet';
    return 'desktop';
  }, [breakpoints]);

  const isBreakpoint = useCallback((breakpoint: keyof Breakpoints) => {
    return size.width < breakpoints[breakpoint];
  }, [size.width, breakpoints]);

  useEffect(() => {
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }
    };
  }, [handleResize]);

  return {
    ...size,
    getBreakpoint,
    isBreakpoint,
  };
}; 