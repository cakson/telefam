import { useUnmountCleanup } from '../../../lib/react-utils';

import { createSignal } from '../../../util/signals';

export const [getIsVideoWaiting, setIsVideoWaiting] = createSignal(false);

export default function useVideoWaitingSignal() {
  useUnmountCleanup(() => {
    setIsVideoWaiting(false);
  });

  return [getIsVideoWaiting, setIsVideoWaiting] as const;
}
