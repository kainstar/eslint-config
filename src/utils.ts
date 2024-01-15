import type { Awaitable, UserConfigItem } from './types';

export const parserPlain = {
  meta: {
    name: 'parser-plain',
  },
  parseForESLint: (code: string) => ({
    ast: {
      body: [],
      comments: [],
      loc: { end: code.length, start: 0 },
      range: [0, code.length],
      tokens: [],
      type: 'Program',
    },
    scopeManager: null,
    services: { isPlain: true },
    visitorKeys: {
      Program: [],
    },
  }),
};

/**
 * Combine array and non-array configs into a single array.
 */
export async function combine(
  ...configs: Array<Awaitable<UserConfigItem | UserConfigItem[]>>
): Promise<UserConfigItem[]> {
  const resolved = await Promise.all(configs);
  return resolved.flat();
}

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m;
  return (resolved as any).default || resolved;
}

export function mapValues<T, U>(obj: Record<string, T>, fn: (value: T, key: string) => U): Record<string, U> {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, fn(value, key)]));
}
