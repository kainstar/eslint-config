import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors';

import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN } from '../globs';
import type { FlatConfigItem, OptionsComponentExts, OptionsFiles, OptionsOverrides } from '../types';
import { interopDefault, mapValues, parserPlain } from '../utils';

export async function markdown(
  options: OptionsFiles &
    OptionsComponentExts &
    OptionsOverrides & {
      prettier?: boolean;
    } = {},
): Promise<FlatConfigItem[]> {
  const { componentExts = [], files = [GLOB_MARKDOWN], overrides = {}, prettier = true } = options;

  const [markdown, pluginTs] = await Promise.all([
    interopDefault(import('eslint-plugin-markdown')),
    interopDefault(import('@typescript-eslint/eslint-plugin')),
  ] as const);

  return [
    {
      name: 'kainstar:markdown:setup',
      plugins: {
        markdown,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserPlain,
      },
      name: 'kainstar:markdown:parser',
      rules: {
        'prettier/prettier': prettier
          ? [
              'error',
              {
                parser: 'markdown',
              },
            ]
          : 'off',
      },
    },
    {
      files,
      ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
      name: 'kainstar:markdown:processor',
      // `eslint-plugin-markdown` only creates virtual files for code blocks,
      // but not the markdown file itself. We use `eslint-merge-processors` to
      // add a pass-through processor for the markdown file itself.
      processor: mergeProcessors([markdown.processors.markdown, processorPassThrough]),
    },
    {
      files: [GLOB_MARKDOWN_CODE, ...componentExts.map((ext) => `${GLOB_MARKDOWN}/**/*.${ext}`)],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            impliedStrict: true,
          },
        },
      },
      name: 'kainstar:markdown:disables',
      rules: {
        'import/newline-after-import': 'off',

        'no-alert': 'off',
        'no-console': 'off',
        'no-labels': 'off',
        'no-lone-blocks': 'off',
        'no-restricted-syntax': 'off',
        'no-undef': 'off',
        'no-unused-expressions': 'off',
        'no-unused-labels': 'off',
        'no-unused-vars': 'off',

        '@typescript-eslint/consistent-type-imports': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-redeclare': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-var-requires': 'off',

        'unicode-bom': 'off',

        // disable Type aware rules
        ...mapValues(pluginTs.configs.strict.rules ?? {}, () => 'off'),

        ...overrides,
      },
    },
  ];
}