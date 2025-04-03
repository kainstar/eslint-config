import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import { interopDefault } from '@antfu/eslint-config';

export async function importsSort(): Promise<TypedFlatConfigItem[]> {
  const pluginSimpleImportSort = await interopDefault(import('eslint-plugin-simple-import-sort'))

  return [
    {
      name: 'kainstar:imports-sort',
      plugins: {
        'simple-import-sort': pluginSimpleImportSort,
      },
      rules: {
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
