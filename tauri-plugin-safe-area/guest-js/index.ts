import { invoke } from '@tauri-apps/api/core'

export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export async function ping(value: string): Promise<string | null> {
  return await invoke<{value?: string}>('plugin:safe-area|ping', {
    payload: {
      value,
    },
  }).then((r) => (r.value ? r.value : null));
}

export async function applyConstraints(): Promise<any> {
  return await invoke('plugin:safe-area|apply_constraints');
}

export async function getSafeAreaInsets(): Promise<SafeAreaInsets> {
  return await invoke<SafeAreaInsets>('plugin:safe-area|get_safe_area_insets');
}
