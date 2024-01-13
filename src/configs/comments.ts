import type { FlatConfigItem } from '../types';
import { interopDefault } from '../utils';

export async function comments(): Promise<FlatConfigItem[]> {
  const pluginEslintComments = await interopDefault(import('eslint-plugin-eslint-comments'));

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
        'eslint-comments/no-unused-enable': 'error',
      },
    },
  ];
}
