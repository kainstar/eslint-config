import type {
  EslintCommentsRules,
  EslintRules,
  FlatESLintConfigItem,
  ImportRules,
  MergeIntersection,
  ReactHooksRules,
  ReactRules,
  RuleConfig,
  VitestRules,
  VueRules,
  YmlRules,
} from '@antfu/eslint-define-config';
import type { RuleOptions as TypeScriptRules } from '@eslint-types/typescript-eslint/types';
import type { ParserOptions } from '@typescript-eslint/parser';
import type { Linter } from 'eslint';
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';
import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks';

export type WrapRuleConfig<T extends { [key: string]: any }> = {
  [K in keyof T]: T[K] extends RuleConfig ? T[K] : RuleConfig<T[K]>;
};

export type Awaitable<T> = T | Promise<T>;

export type Rules = WrapRuleConfig<
  MergeIntersection<
    TypeScriptRules &
      YmlRules &
      ReactHooksRules &
      ReactRules &
      ImportRules &
      EslintRules &
      VitestRules &
      VueRules &
      EslintCommentsRules
  >
>;

export type FlatConfigItem = Omit<FlatESLintConfigItem<Rules, false>, 'plugins'> & {
  /**
   * Custom name of each config item
   */
  name?: string;

  // Relax plugins type limitation, as most of the plugins did not have correct type info yet.
  /**
   * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>;
};

export type UserConfigItem = FlatConfigItem | Linter.FlatConfig;

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[];
}

export interface OptionsVue extends OptionsOverrides {
  /**
   * Create virtual files for Vue SFC blocks to enable linting.
   *
   * @see https://github.com/antfu/eslint-processor-vue-blocks
   * @default true
   */
  sfcBlocks?: boolean | VueBlocksOptions;
}

export type OptionsTypescript = OptionsTypeScriptParserOptions & OptionsOverrides;

export interface OptionsPrettier {
  /**
   * Enable formatting support for HTML.
   */
  html?: boolean;

  /**
   * Enable formatting support for Markdown.
   */
  markdown?: boolean;

  /**
   * Enable formatting support for YAML.
   */
  yaml?: boolean;

  /**
   * Enable formatting support for JSON.
   */
  json?: boolean;
}

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   *
   * @example ['vue']
   * @default []
   */
  componentExts?: string[];
}

export interface OptionsTypeScriptParserOptions {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>;
}

export interface OptionsOverrides {
  overrides?: FlatConfigItem['rules'];
}

export interface OptionsIsInEditor {
  isInEditor?: boolean;
}

export interface OptionsConfig extends OptionsComponentExts {
  /**
   * Enable gitignore support.
   *
   * Passing an object to configure the options.
   *
   * @see https://github.com/antfu/eslint-config-flat-gitignore
   * @default true
   */
  gitignore?: boolean | FlatGitignoreOptions;

  /**
   * Core rules. Can't be disabled.
   */
  javascript?: OptionsOverrides;

  /**
   * TypeScript is basic. Can't be disabled.
   */
  typescript?: OptionsTypescript;

  /**
   * Enable vitest support.
   *
   * @default auto-detect based on the dependencies
   */
  vitest?: boolean | OptionsOverrides;

  /**
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean | OptionsVue;

  /**
   * Enable YAML support.
   *
   * @default true
   */
  yaml?: boolean | OptionsOverrides;

  /**
   * Enable react rules.
   *
   * @default auto-detect based on the dependencies
   */
  react?: boolean | OptionsOverrides;

  /**
   * Enable markdown support.
   *
   * @default true
   */
  markdown?: boolean | OptionsOverrides;

  /**
   * Use 'prettier' to format files.
   *
   * @default true
   */
  prettier?: boolean | OptionsPrettier;

  /**
   * Control to disable some rules in editors.
   * @default auto-detect based on the process.env
   */
  isInEditor?: boolean;
}
