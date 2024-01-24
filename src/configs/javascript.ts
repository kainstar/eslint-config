import js from '@eslint/js';
import globals from 'globals';

import { GLOB_SRC, GLOB_SRC_EXT } from '../globs';
import type { FlatConfigItem, OptionsOverrides } from '../types';

export async function javascript(options: OptionsOverrides = {}): Promise<FlatConfigItem[]> {
  const { overrides = {} } = options;

  return [
    {
      name: 'kainstar:javascript',
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.es2021,
          ...globals.node,
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          sourceType: 'module',
        },
        sourceType: 'module',
      },
      rules: {
        // new version of eslint:recommended
        ...js.configs.recommended.rules,

        'array-callback-return': 'error',
        'block-scoped-var': 'error',
        'default-case-last': 'error',
        eqeqeq: ['error', 'smart'],
        'new-cap': ['error', { capIsNew: false, newIsCap: true, properties: true }],
        'no-alert': 'error',
        'no-array-constructor': 'error',
        'no-caller': 'error',
        'no-cond-assign': ['error', 'always'],
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'no-empty': ['error', { allowEmptyCatch: true }],
        'no-eval': 'error',
        'no-extend-native': 'error',
        'no-extra-bind': 'error',
        'no-implied-eval': 'error',
        'no-iterator': 'error',
        'no-labels': 'error',
        'no-lone-blocks': 'error',
        'no-multi-str': 'error',
        'no-new': 'error',
        'no-new-func': 'error',
        'no-new-object': 'error',
        'no-new-wrappers': 'error',
        'no-octal-escape': 'error',
        'no-proto': 'error',
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-throw-literal': 'error',
        'no-unmodified-loop-condition': 'error',
        'no-unneeded-ternary': ['error', { defaultAssignment: false }],
        'no-unreachable-loop': 'error',
        'no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
          },
        ],
        'no-unused-vars': [
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
        'no-use-before-define': 'error',
        'no-useless-computed-key': 'error',
        'no-useless-constructor': 'error',
        'no-useless-rename': 'error',
        'no-var': 'error',
        'object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        'one-var': ['error', { initialized: 'never' }],
        'prefer-arrow-callback': [
          'error',
          {
            allowNamedFunctions: false,
            allowUnboundThis: true,
          },
        ],
        'prefer-const': [
          'error',
          {
            destructuring: 'all',
            ignoreReadBeforeAssign: true,
          },
        ],
        'prefer-exponentiation-operator': 'error',
        'prefer-promise-reject-errors': 'error',
        'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'symbol-description': 'error',

        'unicode-bom': 'error',
        'vars-on-top': 'error',

        ...overrides,
      },
    },
    {
      files: [`scripts/${GLOB_SRC}`, `cli.${GLOB_SRC_EXT}`],
      name: 'kainstar:scripts-overrides',
      rules: {
        'no-console': 'off',
      },
    },
  ];
}
