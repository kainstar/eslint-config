import { mergeProcessors } from 'eslint-merge-processors';

import { GLOB_VUE } from '../globs';
import type { FlatConfigItem, OptionsFiles, OptionsOverrides, OptionsVue } from '../types';
import { interopDefault } from '../utils';

export async function vue(options: OptionsVue & OptionsOverrides & OptionsFiles = {}): Promise<FlatConfigItem[]> {
  const { files = [GLOB_VUE], overrides = {} } = options;

  const sfcBlocks = options.sfcBlocks === true ? {} : options.sfcBlocks ?? {};

  const [pluginVue, parserVue, processorVueBlocks] = await Promise.all([
    interopDefault(import('eslint-plugin-vue')),
    interopDefault(import('vue-eslint-parser')),
    interopDefault(import('eslint-processor-vue-blocks')),
  ] as const);

  return [
    {
      name: 'kainstar:vue:setup',
      plugins: {
        vue: pluginVue,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          extraFileExtensions: ['.vue'],
          parser: (await interopDefault(import('@typescript-eslint/parser'))) as any,
          sourceType: 'module',
        },
      },
      name: 'kainstar:vue:rules',
      processor:
        sfcBlocks === false
          ? pluginVue.processors['.vue']
          : mergeProcessors([pluginVue.processors['.vue'], processorVueBlocks(sfcBlocks)]),
      rules: {
        ...pluginVue.configs.base.rules,
        ...pluginVue.configs['vue3-essential'].rules,
        ...pluginVue.configs['vue3-strongly-recommended'].rules,
        ...pluginVue.configs['vue3-recommended'].rules,

        'vue/html-self-closing': [
          'error',
          {
            html: {
              component: 'always',
              normal: 'always',
              void: 'any',
            },
            math: 'always',
            svg: 'always',
          },
        ],

        'vue/block-order': [
          'error',
          {
            order: ['script', 'template', 'style'],
          },
        ],
        'vue/component-options-name-casing': ['error', 'PascalCase'],
        'vue/custom-event-name-casing': ['error', 'camelCase'],
        'vue/define-macros-order': [
          'error',
          {
            order: ['defineOptions', 'defineModel', 'defineProps', 'defineEmits', 'defineSlots'],
            defineExposeLast: true,
          },
        ],
        'vue/eqeqeq': ['error', 'smart'],
        'vue/max-attributes-per-line': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/no-empty-pattern': 'error',
        'vue/no-irregular-whitespace': 'error',
        'vue/no-loss-of-precision': 'error',
        'vue/no-restricted-v-bind': ['error', '/^v-/'],
        // it's useful, but why antfu and sxzz off it?
        'vue/no-setup-props-reactivity-loss': 'error',
        'vue/no-sparse-arrays': 'error',
        'vue/no-unused-refs': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/no-v-html': 'off',
        'vue/object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        'vue/prefer-separate-static-class': 'error',
        'vue/prefer-template': 'error',
        'vue/require-default-prop': 'off',

        // stylish
        'vue/block-tag-newline': [
          'error',
          {
            multiline: 'always',
            singleline: 'always',
          },
        ],
        'vue/padding-line-between-blocks': ['error', 'always'],
        'vue/html-comment-content-spacing': [
          'error',
          'always',
          {
            exceptions: ['-'],
          },
        ],

        ...overrides,
      },
    },
  ];
}
