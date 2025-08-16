import React, { createContext as reactCreateContext, useContext } from 'react';
import type { Signal } from '../../util/signals';
import { createSignal } from '../../util/signals';

export type Context<T> = React.Context<T>;

export function createContext<T>(defaultValue?: T): Context<T> {
  return reactCreateContext<T>(defaultValue as T);
}

export function useContextSignal<T>(context: Context<T>): Signal<T> {
  const value = useContext(context);
  const [getSignal] = useSignal(value);
  return getSignal;
}

export function useSignal<T>(initial?: T) {
  const signalRef = React.useRef<ReturnType<typeof createSignal<T>>>();
  signalRef.current ??= createSignal<T>(initial);
  return signalRef.current;
}