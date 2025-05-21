import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin'

let cjs = process.env.FORMAT === 'cjs' ? 'cjs' : '';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: `dist/index.${cjs || 'esm.js'}`,
      format: cjs || 'esm',
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
    '@coderosh/image-size',
    /^buffer/,
    'pixelmatch',
    '@cucumber/cucumber-expressions',
    '@cucumber/gherkin',
    '@cucumber/messages',
    '@cucumber/tag-expressions',
    /^lodash/,
    'read-pkg',
    'unicorn-magic',
  ]
};
