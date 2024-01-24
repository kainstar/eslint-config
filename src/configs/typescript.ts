import process from 'node:process';

import { GLOB_SRC } from '../globs';
import type { FlatConfigItem, OptionsComponentExts, OptionsFiles, OptionsTypescript } from '../types';
import { interopDefault } from '../utils';

export async function typescript(
  options: OptionsFiles & OptionsComponentExts & OptionsTypescript = {},
): Promise<FlatConfigItem[]> {
  const { componentExts = [], overrides = {}, parserOptions = {} } = options;

  const files = options.files ?? [GLOB_SRC, ...componentExts.map((ext) => `**/*.${ext}`)];

  const [pluginTs, parserTs] = await Promise.all([
    interopDefault(import('@typescript-eslint/eslint-plugin')),
    interopDefault(import('@typescript-eslint/parser')),
  ] as const);

  return [
    {
      // Install the plugins without globs, so they can be configured separately.
      name: 'kainstar:typescript:setup',
      plugins: {
        '@typescript-eslint': pluginTs,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          extraFileExtensions: componentExts.map((ext) => `.${ext}`),
          sourceType: 'module',
          ...(parserOptions.project
            ? {
                project: parserOptions.project,
                tsconfigRootDir: process.cwd(),
              }
            : {}),
          ...(parserOptions as any),
        },
      },
      name: 'kainstar:typescript:rules',
      rules: {
        ...pluginTs.configs['eslint-recommended'].overrides![0].rules,
        ...pluginTs.configs.strict.rules,

        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'error',
        '@typescript-eslint/ban-ts-comment': [
          'error',
          {
            'ts-ignore': 'allow-with-description',
          },
        ],
        '@typescript-eslint/prefer-ts-expect-error': 'error',
        '@typescript-eslint/consistent-type-assertions': [
          'error',
          {
            assertionStyle: 'as',
            objectLiteralTypeAssertions: 'allow',
          },
        ],
        '@typescript-eslint/prefer-literal-enum-member': [
          'error',
          {
            allowBitwiseExpressions: true,
          },
        ],
        '@typescript-eslint/ban-types': [
          'error',
          {
            types: {
              Function: false,
              '{}': false,
            },
          },
        ],
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            disallowTypeAnnotations: true,
            prefer: 'type-imports',
            fixStyle: 'inline-type-imports',
          },
        ],
        '@typescript-eslint/no-dynamic-delete': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-import-type-side-effects': 'error',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-require-imports': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'none',
            argsIgnorePattern: '^_',
            vars: 'all',
            varsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            caughtErrors: 'none',
            ignoreRestSiblings: true,
          },
        ],
        '@typescript-eslint/triple-slash-reference': 'off',
        '@typescript-eslint/unified-signatures': 'off',

        ...overrides,
      },
    },
    {
      files: ['**/*.cjs'],
      name: 'kainstar:typescript:javascript-overrides',
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ];
}
