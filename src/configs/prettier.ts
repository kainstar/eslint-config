import { GLOB_HTML, GLOB_JSON, GLOB_MARKDOWN, GLOB_YAML } from '../globs';
import type { FlatConfigItem, OptionsPrettier } from '../types';
import { interopDefault, parserPlain } from '../utils';

export async function prettier(options: OptionsPrettier | true): Promise<FlatConfigItem[]> {
  const pluginPrettier = await interopDefault(import('eslint-plugin-prettier'));
  const eslintConfigPrettier = await interopDefault(import('eslint-config-prettier'));

  if (options === true) {
    options = {
      html: true,
      markdown: true,
      yaml: true,
      json: true,
    };
  }

  const configs: FlatConfigItem[] = [
    {
      name: 'kainstar:prettier:setup',
      plugins: {
        prettier: pluginPrettier,
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
      name: 'kainstar:prettier:html',
      files: [GLOB_HTML],
      languageOptions: {
        parser: parserPlain,
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

  if (options.json) {
    configs.push({
      name: 'kainstar:prettier:json',
      files: [GLOB_JSON],
      languageOptions: {
        parser: parserPlain,
      },
      rules: {
        'prettier/prettier': 'error',
      },
    });
  }

  if (options.markdown) {
    configs.push({
      name: 'kainstar:prettier:markdown',
      files: [GLOB_MARKDOWN],
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

  if (options.yaml) {
    configs.push({
      name: 'kainstar:prettier:yaml',
      files: [GLOB_YAML],
      rules: {
        'prettier/prettier': 'error',
      },
    });
  }

  return configs;
}
