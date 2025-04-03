import type { OptionsIsInEditor, OptionsOverrides } from '@antfu/eslint-config';
import { javascript as antfuJavascript, typescript as antfuTypescript } from '@antfu/eslint-config';

export * from '@antfu/eslint-config';
export { prettier } from './configs/prettier';
export { importsSort } from './configs/imports-sort';

export function javascript(options?: OptionsIsInEditor & OptionsOverrides) {
  return antfuJavascript({
    ...options,
    overrides: {
      'antfu/no-top-level-await': 'off',
    },
  });
}

export function typescript(options?: OptionsIsInEditor & OptionsOverrides) {
  return antfuTypescript({
    ...options,
    overrides: {
      'ts/ban-ts-comment': [
          'error',
          {
            'ts-ignore': 'allow-with-description',
          },
        ],
        'ts/prefer-ts-expect-error': 'off',
      'antfu/no-top-level-await': 'off',
    },
  });
}
