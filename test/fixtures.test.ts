import { join, resolve } from 'node:path';
import { execa } from 'execa';
import fg from 'fast-glob';
import fs from 'fs-extra';
import { afterAll, beforeAll, it } from 'vitest';

import type { OptionsConfig } from '../src/types';

beforeAll(async () => {
  await fs.rm('_fixtures', { recursive: true, force: true });
});

afterAll(async () => {
  // await fs.rm('_fixtures', { recursive: true, force: true });
});

function runWithConfig(name: string, configs: OptionsConfig) {
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
  ${JSON.stringify({
    gitignore: false,
    ...configs,
  })}
)
  `,
      );

      // pnpm eslint will force run in project root path, so use absolute path
      await execa('pnpm', ['eslint', '-c', `${target}/eslint.config.js`, target, '--fix'], {
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

runWithConfig('all', {
  vue: true,
  react: true,
  custom: [
    {
      settings: {
        react: {
          version: '18.2.0',
        },
      },
    },
  ],
});
