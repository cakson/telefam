import type { CSSProperties } from 'react';

type Parts = (string | false | undefined)[];

export default function buildStyle(...parts: Parts): CSSProperties | undefined {
  const styleString = parts.filter(Boolean).join(';');
  if (!styleString) {
    return undefined;
  }

  const styleObj: Record<string, string> = {};
  styleString.split(';').forEach((part) => {
    const [rawKey, rawValue] = part.split(':');
    if (!rawKey || rawValue === undefined) {
      return;
    }

    const key = rawKey.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    styleObj[key] = rawValue.trim();
  });

  return styleObj as CSSProperties;
}
