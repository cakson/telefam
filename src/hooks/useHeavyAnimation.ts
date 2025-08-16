import {
  getIsHeavyAnimating,
  useCallback, useEffect, useMemo, useRef,
} from '../lib/react-utils';

import useLastCallback from './useLastCallback';

// Simple React 18 compatible implementation without reactive patterns

export default function useHeavyAnimation(
  onStart?: AnyToVoidFunction,
  onEnd?: AnyToVoidFunction,
  isDisabled = false,
) {
  const onStartRef = useRef(onStart);
  const onEndRef = useRef(onEnd);
  
  // Update refs without causing re-renders
  onStartRef.current = onStart;
  onEndRef.current = onEnd;

  useEffect(() => {
    if (isDisabled) {
      return undefined;
    }

    // Simple polling-based approach instead of reactive subscriptions
    let wasAnimating = getIsHeavyAnimating();
    
    const checkAnimation = () => {
      const isAnimating = getIsHeavyAnimating();
      
      if (isAnimating && !wasAnimating) {
        // Animation started
        onStartRef.current?.();
      } else if (!isAnimating && wasAnimating) {
        // Animation ended
        onEndRef.current?.();
      }
      
      wasAnimating = isAnimating;
    };

    // Check on mount
    if (getIsHeavyAnimating()) {
      onStartRef.current?.();
    }

    // Poll for changes
    const interval = setInterval(checkAnimation, 16); // ~60fps

    return () => {
      clearInterval(interval);
    };
  }, [isDisabled]); // Only depend on isDisabled to avoid re-renders
}

// TODO → `onFullyIdle`?
export function useThrottleForHeavyAnimation<T extends AnyToVoidFunction>(afterHeavyAnimation: T, deps: unknown[]) {
  // Store the latest function in a ref to avoid dependency issues
  const fnRef = useRef<T>(afterHeavyAnimation);
  const isScheduledRef = useRef(false);
  
  // Update the ref when dependencies change
  // eslint-disable-next-line react-hooks-static-deps/exhaustive-deps
  fnRef.current = useCallback(afterHeavyAnimation, deps) as T;

  // Return a stable function reference that doesn't change
  return useCallback((...args: Parameters<T>) => {
    if (isScheduledRef.current) {
      return; // Already scheduled
    }
    
    if (!getIsHeavyAnimating()) {
      // Not animating, execute immediately
      fnRef.current(...args);
      return;
    }

    // Schedule for after animation ends
    isScheduledRef.current = true;
    
    const checkForEnd = () => {
      if (!getIsHeavyAnimating()) {
        fnRef.current(...args);
        isScheduledRef.current = false;
      } else {
        // Still animating, check again next frame
        requestAnimationFrame(checkForEnd);
      }
    };
    
    requestAnimationFrame(checkForEnd);
  }, []) as T; // Empty dependency array for stable reference
}
