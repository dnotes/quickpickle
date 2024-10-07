import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
  ],
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        'import.meta?.env?.MODE': JSON.stringify('production'),
        'process?.env?.NODE_ENV': JSON.stringify('production'),
      }
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
    }),
  ],
  external: [
    '@cucumber/cucumber',
    '@cucumber/cucumber-expressions',
    '@cucumber/gherkin',
    '@cucumber/messages',
    '@cucumber/tag-expressions',
    'fast-glob',
    'lodash-es',
    'path',
  ] // Add any external libraries that you do not want to bundle here
};
