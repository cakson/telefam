import { useMemo } from '../../../lib/react-utils';

import { calculateSlideSizes } from '../helpers/dimensions';

import useWindowSize from '../../../hooks/window/useWindowSize';

export default function useSlideSizes() {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  return useMemo(() => calculateSlideSizes(windowWidth, windowHeight), [windowWidth, windowHeight]);
}
