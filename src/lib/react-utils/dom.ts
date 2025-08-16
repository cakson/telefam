// DOM manipulation utilities for React compatibility

// Simple implementations of Teact DOM utilities
export function addExtraClass(element: HTMLElement, className: string) {
  element.classList.add(className);
}

export function removeExtraClass(element: HTMLElement, className: string) {
  element.classList.remove(className);
}

export function toggleExtraClass(element: HTMLElement, className: string, force?: boolean) {
  if (force !== undefined) {
    element.classList.toggle(className, force);
  } else {
    element.classList.toggle(className);
  }
}

export function setExtraStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration> & Record<string, any>) {
  Object.entries(styles).forEach(([prop, value]) => {
    if (prop.startsWith('--')) {
      element.style.setProperty(prop, value);
    } else {
      (element.style as any)[prop] = value;
    }
  });
}