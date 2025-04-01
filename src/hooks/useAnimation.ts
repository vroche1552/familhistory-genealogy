import { useState, useEffect, useCallback, useRef } from 'react';

interface AnimationOptions {
  duration?: number;
  delay?: number;
  easing?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onProgress?: (progress: number) => void;
}

interface AnimationState {
  isAnimating: boolean;
  progress: number;
  isPaused: boolean;
}

export const useAnimation = (options: AnimationOptions = {}) => {
  const {
    duration = 300,
    delay = 0,
    easing = 'ease-in-out',
    onStart,
    onEnd,
    onProgress,
  } = options;

  const [state, setState] = useState<AnimationState>({
    isAnimating: false,
    progress: 0,
    isPaused: false,
  });

  const animationFrame = useRef<number>();
  const startTime = useRef<number>();
  const pausedTime = useRef<number>();

  const ease = useCallback((t: number): number => {
    switch (easing) {
      case 'ease-in-out':
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      case 'ease-in':
        return t * t;
      case 'ease-out':
        return t * (2 - t);
      case 'linear':
        return t;
      default:
        return t;
    }
  }, [easing]);

  const animate = useCallback(() => {
    if (!startTime.current) {
      startTime.current = performance.now();
      onStart?.();
    }

    const currentTime = performance.now();
    const elapsed = currentTime - startTime.current - delay;
    const progress = Math.min(elapsed / duration, 1);

    const easedProgress = ease(progress);
    setState(prev => ({
      ...prev,
      progress: easedProgress,
    }));

    onProgress?.(easedProgress);

    if (progress < 1) {
      animationFrame.current = requestAnimationFrame(animate);
    } else {
      setState(prev => ({
        ...prev,
        isAnimating: false,
        progress: 1,
      }));
      onEnd?.();
    }
  }, [duration, delay, ease, onStart, onEnd, onProgress]);

  const start = useCallback(() => {
    if (state.isAnimating) return;

    setState(prev => ({
      ...prev,
      isAnimating: true,
      progress: 0,
      isPaused: false,
    }));

    startTime.current = undefined;
    animationFrame.current = requestAnimationFrame(animate);
  }, [state.isAnimating, animate]);

  const pause = useCallback(() => {
    if (!state.isAnimating || state.isPaused) return;

    pausedTime.current = performance.now();
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    setState(prev => ({
      ...prev,
      isPaused: true,
    }));
  }, [state.isAnimating, state.isPaused]);

  const resume = useCallback(() => {
    if (!state.isAnimating || !state.isPaused) return;

    const pauseDuration = performance.now() - (pausedTime.current || 0);
    startTime.current = (startTime.current || 0) + pauseDuration;
    pausedTime.current = undefined;

    setState(prev => ({
      ...prev,
      isPaused: false,
    }));

    animationFrame.current = requestAnimationFrame(animate);
  }, [state.isAnimating, state.isPaused, animate]);

  const stop = useCallback(() => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    setState({
      isAnimating: false,
      progress: 0,
      isPaused: false,
    });

    startTime.current = undefined;
    pausedTime.current = undefined;
  }, []);

  const reset = useCallback(() => {
    stop();
    start();
  }, [stop, start]);

  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return {
    ...state,
    start,
    pause,
    resume,
    stop,
    reset,
  };
}; 