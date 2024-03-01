import fs from 'node:fs';
import path from 'node:path';
import prompts from 'prompts';

interface InitializeConfigOptions {
  initEslintConfig: 'js' | 'ts' | false;
  initPrettierConfig: boolean;
}

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const presetsDir = path.resolve(__dirname, '../_presets');

async function installDevDependencies(pkg: string | string[]) {
  await import('@antfu/install-pkg').then((i) => i.installPackage(pkg, { dev: true }));
}

async function run() {
  const cwd = process.cwd();

  const options: InitializeConfigOptions = await prompts([
    {
      name: 'initEslintConfig',
      message: 'Which type of ESLint configuration do you want to initialize?',
      type: 'select',
      choices: [
        {
          title: 'JS',
          description: 'eslint.config.js',
          value: 'js',
        },
        {
          title: 'TS',
          description: 'eslint.config.ts',
          value: 'ts',
        },
        {
          title: 'Skip',
          description: 'Skip this step',
          value: false,
        },
      ],
    },
    {
      name: 'initPrettierConfig',
      message: 'Do you want to initialize Prettier configuration?',
      type: 'toggle',
      active: 'yes',
      inactive: 'no',
      initial: 'yes',
    },
  ]);

  const packageJsonFile = path.join(cwd, 'package.json');
  const pkgContent = await fs.promises.readFile(packageJsonFile, 'utf-8');
  const pkg: Record<string, any> = JSON.parse(pkgContent);
  const isESM = pkg.type === 'module';

  async function initializeEslintConfig() {
    console.log('Initializing ESLint configuration...');

    const isTS = options.initEslintConfig === 'ts';
    const eslintConfigFile = path.join(cwd, 'eslint.config' + (isTS ? '.ts' : '.js'));
    if (fs.existsSync(eslintConfigFile)) {
      console.warn('ESLint configuration already exists, skip this initialize.');
    } else {
      const eslintConfigContent =
        isESM || isTS
          ? `import kainstar from '@kainstar/eslint-config';\n\nexport default kainstar();`
          : `const kainstar = require('@kainstar/eslint-config').default;\n\nmodule.exports = kainstar({});`;
      fs.writeFileSync(eslintConfigFile, eslintConfigContent, 'utf8');
    }

    const eslintTsPatchDep: string | undefined = pkg.devDependencies?.['eslint-ts-patch'];
    if (options.initEslintConfig === 'ts' && !eslintTsPatchDep) {
      console.log('Installing eslint-ts-patch...');
      await installDevDependencies(['eslint-ts-patch', 'eslint@npm:eslint-ts-patch']);
    }
  }

  if (options.initEslintConfig) {
    await initializeEslintConfig();
  }

  async function initializePrettierConfig() {
    console.log('Initializing Prettier configuration...');

    const prettierConfigFile = path.join(cwd, 'prettier.config.js');
    if (fs.existsSync(prettierConfigFile)) {
      console.warn('Prettier configuration already exists, skip this initialize.');
    } else {
      const presetPrettierConfigFile = path.join(presetsDir, 'prettier.config.js');
      await fs.promises.copyFile(presetPrettierConfigFile, prettierConfigFile);
    }

    const prettierDep: string | undefined = pkg.devDependencies?.['prettier'];
    if (!prettierDep) {
      console.log('Installing Prettier...');
      await installDevDependencies(['prettier']);
    }
  }

  if (options.initPrettierConfig) {
    initializePrettierConfig();
  }
}

run().catch((err) => {
  console.error('Failed to initialize configuration.');
  console.error(err);
});
