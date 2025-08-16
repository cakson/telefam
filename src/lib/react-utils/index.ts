// Main React compatibility layer for Teact migration
import React from 'react';

// Re-export all React functionality
export default React;

// Export individual hooks and utilities
export {
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
  useRef,
  useContext,
  useReducer,
  useImperativeHandle,
  useDeferredValue,
  useId,
  useInsertionEffect,
  useSyncExternalStore,
  useTransition,
} from 'react';

// Custom hooks for Teact compatibility
export {
  useLastCallback,
  useFlag,
  useUnmountCleanup,
} from './hooks';

// Context utilities
export {
  createContext,
  useContextSignal,
  useSignal,
} from './context';

// Memo and component utilities
export {
  memo,
  Fragment,
  createElement,
} from './memo';

export type {
  FC,
  Props,
  TeactNode,
  RefObject,
  VirtualElement,
} from './memo';

// DOM utilities
export {
  addExtraClass,
  removeExtraClass,
  toggleExtraClass,
  setExtraStyles,
} from './dom';

// State management utilities
export {
  addCallback,
  removeCallback,
  typify,
} from './state';

export type { ActionOptions } from './state';

// Event utilities
export {
  resolveEventType,
} from './events';

// Animation utilities
export {
  throttleWithFullyIdle,
} from './animation';

// Heavy animation utilities - Simple React 18 compatible implementation
let isHeavyAnimating = false;
let animationTimeouts = new Set<NodeJS.Timeout>();

export function getIsHeavyAnimating(): boolean {
  return isHeavyAnimating;
}

// Add minimal compatibility methods that don't cause re-renders
(getIsHeavyAnimating as any).subscribe = () => {
  // No-op for compatibility - we don't want reactive subscriptions
  return () => {};
};

(getIsHeavyAnimating as any).once = (callback: () => void) => {
  // Simple timeout-based implementation instead of reactive
  if (!isHeavyAnimating) {
    callback();
    return () => {};
  }
  
  const checkInterval = setInterval(() => {
    if (!isHeavyAnimating) {
      callback();
      clearInterval(checkInterval);
    }
  }, 16); // Check every frame
  
  return () => clearInterval(checkInterval);
};

export function beginHeavyAnimation(duration = 1000): void {
  isHeavyAnimating = true;
  
  const timeout = setTimeout(() => {
    isHeavyAnimating = false;
    animationTimeouts.delete(timeout);
  }, duration);
  
  animationTimeouts.add(timeout);
}

export function endHeavyAnimation(): void {
  isHeavyAnimating = false;
  animationTimeouts.forEach(timeout => clearTimeout(timeout));
  animationTimeouts.clear();
}

export function onFullyIdle(callback: () => void): void {
  // Placeholder implementation - use requestIdleCallback or setTimeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback);
  } else {
    setTimeout(callback, 0);
  }
}

// Debug utilities for compatibility
export function DEBUG_resolveComponentName(Component: any) {
  const { name, DEBUG_contentComponentName } = Component;

  if (name === 'TeactNContainer') {
    return `container>${DEBUG_contentComponentName}`;
  }

  if (name === 'TeactMemoWrapper') {
    return `memo>${DEBUG_contentComponentName}`;
  }

  if (name === 'TeactContextProvider') {
    return `context>id${DEBUG_contentComponentName}`;
  }

  return name + (DEBUG_contentComponentName ? `>${DEBUG_contentComponentName}` : '');
}