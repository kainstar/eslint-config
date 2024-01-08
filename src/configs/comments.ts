import type { FlatConfigItem } from '../types';

import { pluginEslintComments } from '../untypes-plugins';

export async function comments(): Promise<FlatConfigItem[]> {
  return [
    {
      name: 'kainstar:eslint-comments',
      plugins: {
        'eslint-comments': pluginEslintComments,
      },
      rules: {
        'eslint-comments/no-aggregating-enable': 'error',
        'eslint-comments/no-duplicate-disable': 'error',
        'eslint-comments/no-unlimited-disable': 'error',
        'eslint-comments/no-unused-disable': 'error',
        'eslint-comments/no-unused-enable': 'error',
      },
    },
  ];
}
