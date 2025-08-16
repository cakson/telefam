import { useUnmountCleanup } from '../lib/react-utils';

import { createSignal } from '../util/signals';

export const [getCurrentTime, setCurrentTime] = createSignal(0);

export default function useCurrentTimeSignal() {
  useUnmountCleanup(() => {
    setCurrentTime(0);
  });

  return [getCurrentTime, setCurrentTime] as const;
}
