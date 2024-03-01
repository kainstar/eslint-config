import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  format: ['cjs', 'esm'],
  shims: true,
  clean: true,
  dts: {
    entry: 'src/index.ts',
  },
});
