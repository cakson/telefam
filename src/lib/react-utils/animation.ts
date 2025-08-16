// Animation utilities for React compatibility

export function throttleWithFullyIdle<T extends (...args: any[]) => any>(
  fn: T, 
  wait: number = 16
): T {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastCallTime = 0;

  return ((...args: any[]) => {
    const now = Date.now();
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    if (now - lastCallTime >= wait) {
      lastCallTime = now;
      return fn(...args);
    } else {
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        fn(...args);
      }, wait - (now - lastCallTime));
    }
  }) as T;
}