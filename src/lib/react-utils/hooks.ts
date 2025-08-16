import { useCallback, useLayoutEffect, useRef, useState } from 'react';

// Custom hooks for compatibility with Teact patterns

export function useLastCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, []) as T;
}

export function useFlag(initial = false): [boolean, () => void, () => void, () => void] {
  const [value, setValue] = useState(initial);
  
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((prev: boolean) => !prev), []);

  return [value, setTrue, setFalse, toggle];
}

export function useUnmountCleanup(cleanup: () => void) {
  useLayoutEffect(() => {
    return cleanup;
  }, [cleanup]);
}

