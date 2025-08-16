import { useEffect, useRef } from '../lib/react-utils';

function useEffectOnce(effect: React.EffectCallback) {
  const hasRunRef = useRef(false);
  const cleanupRef = useRef<(() => void) | void>();

  useEffect(() => {
    if (hasRunRef.current) {
      return cleanupRef.current;
    }
    
    hasRunRef.current = true;
    cleanupRef.current = effect();
    
    return cleanupRef.current;
  }, []); // eslint-disable-line react-hooks-static-deps/exhaustive-deps
}

export default useEffectOnce;
