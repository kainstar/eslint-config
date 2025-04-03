import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import { GLOB_HTML, GLOB_JSON, GLOB_MARKDOWN, GLOB_YAML, interopDefault, parserPlain } from '@antfu/eslint-config';

interface OptionsPrettier {
  html?: boolean
  markdown?: boolean
  yaml?: boolean
  json?: boolean
}

export async function prettier(options: OptionsPrettier | true): Promise<TypedFlatConfigItem[]> {
  const prettierRecommend = await interopDefault(import('eslint-plugin-prettier/recommended'));

  if (options === true) {
    options = {
      html: true,
      markdown: true,
      yaml: true,
      json: true,
    };
  }

  const configs: TypedFlatConfigItem[] = [
    {
      ...prettierRecommend,
      name: 'kainstar:prettier:setup',
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
