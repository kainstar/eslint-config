import { isPackageExists } from 'local-pkg';

import { GLOB_JSX, GLOB_TSX } from '../globs';
import type { FlatConfigItem, OptionsFiles, OptionsOverrides } from '../types';
import { interopDefault } from '../utils';

// react refresh
const ReactRefreshAllowConstantExportPackages = ['vite'];

export async function react(options: OptionsOverrides & OptionsFiles = {}): Promise<FlatConfigItem[]> {
  const { files = [GLOB_JSX, GLOB_TSX], overrides = {} } = options;

  const [pluginReact, pluginReactHooks, pluginReactRefresh] = await Promise.all([
    interopDefault(import('eslint-plugin-react')),
    interopDefault(import('eslint-plugin-react-hooks')),
    interopDefault(import('eslint-plugin-react-refresh')),
  ] as const);

  const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some((i) => isPackageExists(i));

  return [
    {
      name: 'kainstar:react:setup',
      plugins: {
        react: pluginReact,
        'react-hooks': pluginReactHooks,
        'react-refresh': pluginReactRefresh,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
    {
      files,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      name: 'kainstar:react:rules',
      rules: {
        // recommended rules react-hooks
        'react-hooks/exhaustive-deps': 'warn',
        'react-hooks/rules-of-hooks': 'error',

        // react refresh
        'react-refresh/only-export-components': ['warn', { allowConstantExport: isAllowConstantExport }],

        // react rules
        'react/display-name': 'error',
        'react/jsx-key': 'error',
        'react/jsx-no-comment-textnodes': 'error',
        'react/no-children-prop': 'error',
        'react/no-danger-with-children': 'error',
        'react/no-deprecated': 'error',
        'react/require-render-return': 'error',
        'react/self-closing-comp': 'error',

        // class component only
        'react/no-direct-mutation-state': 'error',
        'react/no-find-dom-node': 'error',
        'react/no-is-mounted': 'error',
        'react/no-string-refs': 'error',

        // less than React 18
        'react/no-render-return-value': 'error',

        // overrides
        ...overrides,
      },
    },
  ];
}
