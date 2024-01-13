# @kainstar/eslint-config

[![npm package][npm-img]][npm-url] [![Build Status][build-img]][build-url] [![Downloads][downloads-img]][downloads-url] [![Issues][issues-img]][issues-url] [![Code Coverage][codecov-img]][codecov-url] [![Commitizen Friendly][commitizen-img]][commitizen-url] [![Semantic Release][semantic-release-img]][semantic-release-url]

ESLint config for Kainstar projects

Thanks antfu's [eslint-config](https://github.com/antfu/eslint-config), this project is based on it.

- All plugins as dependencies, don't need to install them manually
- TypeScript is basic, so remove or off rules that can be checked by the TypeScript compiler.
- Not check style (should use stylelint) and other file types not used in normal times.

## Usage

### Install

```bash
pnpm i -D eslint @kainstar/eslint-config
```

### Create config file

With [`"type": "module"`](https://nodejs.org/api/packages.html#type) in `package.json` (recommended):

```js
// eslint.config.js
import kainstar from '@kainstar/eslint-config';

export default kainstar();
```

## VS Code support (auto fix)

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Add the following settings to your `.vscode/settings.json`:

```jsonc
{
  // Enable the ESlint flat config support
  "eslint.experimental.useFlatConfig": true,

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never",
  },

  // Silent the stylish related rules in you IDE, but still auto fix them
  "eslint.rules.customizations": [
    { "rule": "prettier/prettier", "severity": "off" },
    { "rule": "*-indent", "severity": "off" },
    { "rule": "*-spacing", "severity": "off" },
    { "rule": "*-order", "severity": "off" },
    { "rule": "*-newline", "severity": "off" },
  ],

  // Enable eslint for all supported languages
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "yaml",
  ],
}
```

[build-img]: https://github.com/kainstar/eslint-config/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/kainstar/eslint-config/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/@kainstar/eslint-config
[downloads-url]: https://www.npmtrends.com/@kainstar/eslint-config
[npm-img]: https://img.shields.io/npm/v/@kainstar/eslint-config
[npm-url]: https://www.npmjs.com/package/@kainstar/eslint-config
[issues-img]: https://img.shields.io/github/issues/kainstar/eslint-config
[issues-url]: https://github.com/kainstar/eslint-config/issues
[codecov-img]: https://codecov.io/gh/kainstar/eslint-config/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/kainstar/eslint-config
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
