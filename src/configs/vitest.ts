import { GLOB_TESTS } from '../globs';
import type { FlatConfigItem, OptionsFiles, OptionsIsInEditor, OptionsOverrides } from '../types';
import { interopDefault } from '../utils';

export async function vitest(
  options: OptionsFiles & OptionsIsInEditor & OptionsOverrides = {},
): Promise<FlatConfigItem[]> {
  const { files = GLOB_TESTS, isInEditor = false, overrides = {} } = options;

  const [pluginVitest] = await Promise.all([interopDefault(import('eslint-plugin-vitest'))] as const);

  return [
    {
      name: 'kainstar:vitest:setup',
      plugins: {
        vitest: pluginVitest,
      },
    },
    {
      files,
      name: 'kainstar:vitest:rules',
      rules: {
        'vitest/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
        'vitest/no-conditional-expect': 'error',
        'vitest/no-conditional-tests': 'error',
        'vitest/no-focused-tests': isInEditor ? 'off' : 'error',
        'vitest/no-identical-title': 'error',
        'vitest/no-import-node-test': 'error',
        'vitest/no-standalone-expect': 'error',
        'vitest/no-test-return-statement': 'error',

        'vitest/prefer-hooks-in-order': 'error',
        'vitest/prefer-hooks-on-top': 'error',
        'vitest/prefer-lowercase-title': 'error',
        'vitest/prefer-todo': 'error',

        ...overrides,
      },
    },
  ];
}
