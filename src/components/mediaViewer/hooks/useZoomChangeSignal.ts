import { useUnmountCleanup } from '../../../lib/react-utils';

import { createSignal } from '../../../util/signals';

const [getZoomChange, setZoomChange] = createSignal(1);

export default function useZoomChange() {
  useUnmountCleanup(() => {
    setZoomChange(1);
  });

  return [getZoomChange, setZoomChange] as const;
}
