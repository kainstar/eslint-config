import { join, resolve } from 'node:path';
import { execa } from 'execa';
import fg from 'fast-glob';
import fs from 'fs-extra';
import { afterAll, beforeAll, it } from 'vitest';

import type { FlatConfigItem, OptionsConfig } from '../src/types';

beforeAll(async () => {
  await fs.rm('_fixtures', { recursive: true, force: true });
});
afterAll(async () => {
  await fs.rm('_fixtures', { recursive: true, force: true });
});

function runWithConfig(name: string, configs: OptionsConfig, ...items: FlatConfigItem[]) {
  it.concurrent(
    name,
    async ({ expect }) => {
      const from = resolve('fixtures/input');
      const output = resolve('fixtures/output', name);
      const target = resolve('_fixtures', name);

      await fs.copy(from, target, {
        filter: (src) => {
          return !src.includes('node_modules');
        },
      });
      await fs.writeFile(
        join(target, 'eslint.config.js'),
        `
// @eslint-disable
import kainstar from '@kainstar/eslint-config'

export default kainstar(
  ${JSON.stringify(configs)},
  ...${JSON.stringify(items) ?? []},
)
  `,
      );

      await execa('pnpm', ['eslint', '.', '--fix'], {
        cwd: target,
        stdio: 'pipe',
      });

      const files = await fg('**/*', {
        ignore: ['node_modules', 'eslint.config.js'],
        cwd: target,
      });

      await Promise.all(
        files.map(async (file) => {
          const content = await fs.readFile(join(target, file), 'utf-8');
          const source = await fs.readFile(join(from, file), 'utf-8');
          const outputPath = join(output, file);
          if (content === source) {
            if (fs.existsSync(outputPath)) {
              fs.remove(outputPath);
            }
            return;
          }
          await expect.soft(content).toMatchFileSnapshot(outputPath);
        }),
      );
    },
    30_000,
  );
}

runWithConfig('js', {
  vue: false,
});
runWithConfig('all', {
  vue: true,
});
runWithConfig('no-style', {
  vue: true,
});
runWithConfig(
  'tab-double-quotes',
  {
    vue: true,
  },
  {
    rules: {
      'style/no-mixed-spaces-and-tabs': 'off',
    },
  },
);

// https://github.com/antfu/eslint-config/issues/255
runWithConfig(
  'ts-override',
  {},
  {
    rules: {
      'ts/consistent-type-definitions': ['error', 'type'],
    },
  },
);

runWithConfig('with-formatters', {
  vue: true,
  prettier: true,
});

runWithConfig('no-markdown-with-formatters', {
  vue: false,
  prettier: {
    markdown: true,
  },
});
