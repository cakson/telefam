// Minimal React 18 compatible state management - temporary non-reactive version to avoid infinite loops
import React from 'react';

export interface ActionOptions {
  forceOnHeavyAnimation?: boolean;
  forceSyncOnIOs?: boolean;
  forceOutdated?: boolean;
}

// Global callbacks for backward compatibility
const globalCallbacks = new Set<Function>();

export function addCallback(callback: Function): () => void {
  globalCallbacks.add(callback);
  return () => removeCallback(callback);
}

export function removeCallback(callback: Function): void {
  globalCallbacks.delete(callback);
}

// Minimal state management - NON-REACTIVE to prevent infinite loops
export function typify<GlobalState, ActionPayloads>() {
  let globalState: GlobalState = {} as GlobalState;

  const actionHandlers = new Map<string, Function[]>();
  const actions = {} as any;

  function getGlobal<T extends GlobalState>(): T {
    return globalState as T;
  }

  function setGlobal(state: GlobalState, options?: ActionOptions): void {
    globalState = state;
    
    // Only notify legacy callbacks, no reactive subscriptions for now
    globalCallbacks.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        console.error('Error in global callback:', error);
      }
    });
  }

  function addActionHandler<ActionName extends keyof ActionPayloads>(
    name: ActionName,
    handler: Function
  ): void {
    if (!actionHandlers.has(name as string)) {
      actionHandlers.set(name as string, []);
      
      actions[name as string] = (payload?: any, options?: ActionOptions) => {
        const handlers = actionHandlers.get(name as string) || [];
        
        for (const handlerFn of handlers) {
          try {
            const currentState = getGlobal();
            const result = handlerFn(currentState, actions, payload);
            if (result && typeof result === 'object' && !result.then) {
              setGlobal(result as GlobalState, options);
            }
          } catch (error) {
            console.error(`Error in action handler ${name as string}:`, error);
          }
        }
      };
    }
    
    actionHandlers.get(name as string)!.push(handler);
  }

  // NON-REACTIVE withGlobal - just return current state snapshot
  function withGlobal<OwnProps extends any>(
    mapStateToProps: (global: GlobalState, ownProps: OwnProps) => any,
    activationFn?: Function
  ) {
    return (Component: React.ComponentType<any>) => {
      const WrappedComponent = React.memo((props: OwnProps) => {
        // Get current state snapshot - NO subscriptions
        const mappedProps = React.useMemo(() => {
          try {
            return mapStateToProps(globalState, props);
          } catch (error) {
            console.error('Error in mapStateToProps:', error);
            return {};
          }
        }, [props]); // Re-compute only when own props change

        return React.createElement(Component, { ...mappedProps, ...props });
      });

      return WrappedComponent;
    };
  }

  return {
    getGlobal,
    setGlobal,
    getActions: () => actions,
    addActionHandler,
    withGlobal,
  };
}