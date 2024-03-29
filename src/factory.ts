import fs from 'node:fs';
import process from 'node:process';
import { isPackageExists } from 'local-pkg';

import { prettier } from './configs/prettier';
import { comments, ignores, imports, javascript, markdown, react, typescript, vitest, vue, yaml } from './configs';
import type { Awaitable, FlatConfigItem, OptionsConfig, UserConfigItem } from './types';
import { combine, interopDefault } from './utils';

const VuePackages = ['vue', 'nuxt', 'vitepress', '@slidev/cli'];
const ReactPackages = ['react', 'react-dom', 'next'];

type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>;

function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === 'boolean' ? ({} as any) : options[key] || {};
}

function getOverrides<K extends keyof OptionsConfig>(options: OptionsConfig, key: K) {
  const sub = resolveSubOptions(options, key);
  return {
    ...('overrides' in sub ? sub.overrides : {}),
  };
}

/**
 * Construct an array of ESLint flat config items.
 */
export async function kainstar(
  options: OptionsConfig = {},
  ...userConfigs: Awaitable<UserConfigItem | UserConfigItem[]>[]
): Promise<UserConfigItem[]> {
  const {
    vue: enableVue = VuePackages.some((i) => isPackageExists(i)),
    gitignore: enableGitignore = true,
    isInEditor = !!(
      (process.env.VSCODE_PID || process.env.VSCODE_CWD || process.env.JETBRAINS_IDE || process.env.VIM) &&
      !process.env.CI
    ),
    react: enableReact = ReactPackages.some((i) => isPackageExists(i)),
    yaml: enableYaml = true,
    prettier: enablePrettier = true,
    vitest: enableVitest = isPackageExists('vitest'),
    markdown: enableMarkdown = true,
    componentExts = [...(enableVue ? ['vue'] : [])],
  } = options;

  const configs: Array<Awaitable<FlatConfigItem[]>> = [];

  if (enableGitignore) {
    if (typeof enableGitignore !== 'boolean') {
      configs.push(interopDefault(import('eslint-config-flat-gitignore')).then((r) => [r(enableGitignore)]));
    } else {
      if (fs.existsSync('.gitignore')) {
        configs.push(interopDefault(import('eslint-config-flat-gitignore')).then((r) => [r()]));
      }
    }
  }

  // Base configs
  configs.push(
    ignores(),
    javascript({
      overrides: getOverrides(options, 'javascript'),
    }),
    typescript({
      ...resolveSubOptions(options, 'typescript'),
      componentExts,
    }),
    comments(),
    imports(),
  );

  if (enableVitest) {
    configs.push(
      vitest({
        isInEditor,
        overrides: getOverrides(options, 'vitest'),
      }),
    );
  }

  if (enableVue) {
    configs.push(
      vue({
        ...resolveSubOptions(options, 'vue'),
      }),
    );
  }

  if (enableReact) {
    configs.push(
      react({
        overrides: getOverrides(options, 'react'),
      }),
    );
  }

  if (enableYaml) {
    configs.push(
      yaml({
        overrides: getOverrides(options, 'yaml'),
      }),
    );
  }

  if (enableMarkdown) {
    configs.push(
      markdown({
        componentExts,
        overrides: getOverrides(options, 'markdown'),
      }),
    );
  }

  if (enablePrettier) {
    configs.push(prettier(enablePrettier));
  }

  const merged = combine(...configs, ...userConfigs);

  return merged;
}
