import { GLOB_YAML } from '../globs';
import type { FlatConfigItem, OptionsFiles, OptionsOverrides } from '../types';
import { interopDefault } from '../utils';

export async function yaml(options: OptionsOverrides & OptionsFiles = {}): Promise<FlatConfigItem[]> {
  const { files = [GLOB_YAML], overrides = {} } = options;

  const [pluginYml, parserYaml] = await Promise.all([
    interopDefault(import('eslint-plugin-yml')),
    interopDefault(import('yaml-eslint-parser')),
  ] as const);

  return [
    {
      name: 'kainstar:yaml:setup',
      plugins: {
        yml: pluginYml,
      },
    },
    {
      name: 'kainstar:yaml:rules',
      files,
      languageOptions: {
        parser: parserYaml,
      },
      rules: {
        'yml/spaced-comment': 'error',
        'yml/no-empty-document': 'error',
        'yml/no-empty-mapping-value': 'error',
        'yml/block-mapping': 'error',
        'yml/block-sequence': 'error',
        'yml/no-empty-key': 'error',
        'yml/no-empty-sequence-entry': 'error',
        'yml/no-irregular-whitespace': 'error',
        'yml/plain-scalar': 'error',

        'yml/vue-custom-block/no-parsing-error': 'error',

        ...overrides,
      },
    },
  ];
}
