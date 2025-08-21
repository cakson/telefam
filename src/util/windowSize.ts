import type { IDimensions } from '../types';

import { requestMutation } from '../lib/fasterdom/fasterdom';
import { throttle } from './schedulers';

const WINDOW_ORIENTATION_CHANGE_THROTTLE_MS = 100;
const WINDOW_RESIZE_THROTTLE_MS = 250;

let initialHeight = window.innerHeight;
let currentWindowSize = updateSizes();

const handleResize = throttle(() => {
  currentWindowSize = updateSizes();
}, WINDOW_RESIZE_THROTTLE_MS, true);

const handleOrientationChange = throttle(() => {
  initialHeight = window.innerHeight;
  handleResize();
}, WINDOW_ORIENTATION_CHANGE_THROTTLE_MS, false);

window.addEventListener('orientationchange', handleOrientationChange);
window.addEventListener('resize', handleResize);

export function updateSizes(): IDimensions {
  const height = window.innerHeight;

  requestMutation(() => {
    const vh = height * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

const windowSize = {
  get: () => currentWindowSize,
  getIsKeyboardVisible: () => initialHeight > currentWindowSize.height,
};

export default windowSize;
