import kainstar from './src';

export default kainstar({}, [
  {
    files: ['src/cli.ts'],
    rules: {
      'no-console': 'off',
    },
  },
]);
