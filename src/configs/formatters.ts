import { interopDefault, parserPlain } from '../utils';
import type { FlatConfigItem, OptionsFormatters } from '../types';
import { GLOB_HTML, GLOB_MARKDOWN } from '../globs';

export async function formatters(options: OptionsFormatters | true): Promise<FlatConfigItem[]> {
  const prettier = await interopDefault(import('eslint-plugin-prettier'));
  const eslintConfigPrettier = await interopDefault(import('eslint-config-prettier'));

  if (options === true) {
    options = {
      html: true,
      markdown: true,
    };
  }

  const configs: FlatConfigItem[] = [
    {
      name: 'kainstar:formatters:source',
      plugins: {
        prettier,
      },
      rules: {
        ...eslintConfigPrettier.rules,
        'prettier/prettier': 'error',
        'arrow-body-style': 'off',
        'prefer-arrow-callback': 'off',
      },
    },
  ];

  if (options.html) {
    configs.push({
      name: 'kainstar:formatters:html',
      files: [GLOB_HTML],
      languageOptions: {
        parser: parserPlain,
      },
      plugins: {
        prettier,
      },
      rules: {
        'prettier/prettier': [
          'error',
          {
            parser: 'html',
          },
        ],
      },
    });
  }

  if (options.markdown) {
    configs.push({
      name: 'kainstar:formatters:markdown',
      files: [GLOB_MARKDOWN],
      languageOptions: {
        parser: parserPlain,
      },
      plugins: {
        prettier,
      },
      rules: {
        'prettier/prettier': [
          'error',
          {
            parser: 'markdown',
          },
        ],
      },
    });
  }

  return configs;
}
