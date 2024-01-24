import type { FlatConfigItem } from '../types';
import { interopDefault } from '../utils';

export async function imports(): Promise<FlatConfigItem[]> {
  const [pluginImport, pluginSimpleImportSort] = await Promise.all([
    interopDefault(import('eslint-plugin-i')),
    interopDefault(import('eslint-plugin-simple-import-sort')),
  ] as const);

  return [
    {
      name: 'kainstar:imports',
      plugins: {
        import: pluginImport,
        'simple-import-sort': pluginSimpleImportSort,
      },
      rules: {
        'import/first': 'error',
        'import/newline-after-import': ['error', { considerComments: true, count: 1 }],
        'import/no-absolute-path': 'error',
        'import/no-duplicates': 'error',
        'import/no-empty-named-blocks': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        'import/no-self-import': 'error',

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
