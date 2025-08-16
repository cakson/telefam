import { createRoot } from 'react-dom/client';
import type { ReactElement } from 'react';

// React 18 compatible render function
function render(element: ReactElement, container: HTMLElement) {
  try {
    const root = createRoot(container);
    root.render(element);
    return root;
  } catch (error) {
    console.error('Error during React render:', error);
    throw error;
  }
}

// Export DOM utilities from the compatibility layer
export {
  addExtraClass,
  removeExtraClass,
  toggleExtraClass,
  setExtraStyles,
} from './dom';

// Export additional DOM utilities that might be needed
export {
  flushSync,
  unstable_batchedUpdates as batchedUpdates,
} from 'react-dom';

export default { render };