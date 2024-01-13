import * as pluginImport from 'eslint-plugin-i';
import * as pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';

import type { FlatConfigItem } from '../types';

export async function imports(): Promise<FlatConfigItem[]> {
  return [
    {
      name: 'kainstar:imports',
      plugins: {
        import: pluginImport,
        'simple-import-sort': pluginSimpleImportSort,
      },
      rules: {
        'import/first': 'error',
        'import/newline-after-import': ['error', { considerComments: false, count: 1 }],
        'import/no-absolute-path': 'error',
        'import/no-duplicates': 'error',
        'import/no-empty-named-blocks': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        'import/no-self-import': 'error',
        'import/order': 'error',

        // https://dev.to/julioxavierr/sorting-your-imports-with-eslint-3ped
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // Side effect imports.
              ['^\\u0000'],
              // builtin or pkg dependencies modules
              ['^node:', '^@?\\w'],
              // Internal alias.
              ['^~/.*', '^@/.*'],
              // Parent imports. Put `..` last.
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // Other relative imports. Put same-folder imports and `.` last.
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
              // Style imports.
              ['^.+\\.css$', '^.+\\.scss$'],
            ],
          },
        ],
      },
    },
  ];
}
