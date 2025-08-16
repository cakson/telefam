import React from 'react';

// Re-export React's memo function with Teact-compatible signature
export function memo<T extends React.ComponentType<any>>(
  Component: T,
  debugKey?: string
): T {
  return React.memo(Component) as unknown as T;
}

// Type definitions for compatibility
export type FC<P = {}> = React.FC<P>;
export type Props = Record<string, any>;
export type TeactNode = React.ReactNode;
export type RefObject<T = any> = React.RefObject<T>;
export type VirtualElement = React.ReactElement;

// Fragment export
export const Fragment = React.Fragment;

// createElement export
export const createElement = React.createElement;