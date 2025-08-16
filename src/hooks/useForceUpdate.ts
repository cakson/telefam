import { useCallback, useState } from '../lib/react-utils';

const useForceUpdate = () => {
  const [, setTrigger] = useState<boolean>(false);

  return useCallback(() => {
    setTrigger((trigger) => !trigger);
  }, []);
};

export default useForceUpdate;
