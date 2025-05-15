import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import glob from 'fast-glob';
import path from 'node:path';
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin'

let cjs = process.env.FORMAT === 'cjs' ? 'cjs' : '';

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
      format: cjs || 'esm',
      sourcemap: true,
      exports: 'named',
      entryFileNames: `[name].${cjs || 'mjs'}`
    },
  ],
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        'import.meta?.env?.MODE': JSON.stringify('production'),
        'process?.env?.NODE_ENV': JSON.stringify('production'),
        'lodash-es': cjs ? 'lodash' : 'lodash-es',
      }
    }),
    optimizeLodashImports({
      appendDotJs: false,
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
    }),
  ],
  external: [
    'quickpickle',
    'vite',
    'vitest',
    '@vitest/browser/context',
    'vitest-browser-svelte',
    'vitest-browser-vue',
    'vitest-browser-react',
    /^lodash/,
    'react',
    'pngjs',
    'pixelmatch',
  ]
};