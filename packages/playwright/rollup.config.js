import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import glob from 'fast-glob';
import path from 'node:path';

const input = Object.fromEntries(
  glob.sync('src/**/*.ts').map(file => [
    // This will remove `src/` from the beginning and `.ts` from the end
    path.relative('src', file.slice(0, -3)),
    file
  ])
);

export default {
  input,
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      entryFileNames: '[name].cjs'
    },
    {
      dir: 'dist',
      format: 'esm',
      sourcemap: true,
      exports: 'named',
      entryFileNames: '[name].mjs'
    }
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
    '@playwright/test',
    'playwright',
    'quickpickle',
    'vite',
    'node:path',
    'node:url',
    'lodash-es',
  ]
};