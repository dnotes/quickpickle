import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    root: './packages/main',
    extends: './packages/main/vite.config.ts',
    test: {
      name: 'features',
      include : [ 'tests/*.feature' ],
      setupFiles: [ 'tests/tests.steps.ts' ],
    },
  },
  {
    root: './packages/main',
    extends: './packages/main/vite.config.ts',
    test: {
      name: 'hooks',
      include : [ 'tests/hooks/*.feature' ],
      setupFiles: [ 'tests/tests.steps.ts','tests/hooks/hooks.steps.ts' ],
    },
  },
  {
    root: './packages/main',
    extends: './packages/main/vite.config.ts',
    test: {
      name: 'unit',
      include : [ './tests/*.test.ts' ],
    }
  },
  {
    root: './packages/playwright',
    extends: './packages/playwright/vite.config.ts',
    test: {
      name: 'playwright',
    },
    // @ts-ignore
    quickpickle: {
      skipTags: ['@skip','@wip','@skip-ci'],
      worldConfig: {
      }
    }
  },
  {
    root: './packages/test-commonjs',
    extends: './packages/test-commonjs/vite.config.js',
    test: {
      name: 'commonjs-main',
      include: ['tests/quickpickle/**/*.feature'],
      setupFiles: 'tests/quickpickle.steps.js',
      testTimeout: 5000,
    },
  },
  {
    root: './packages/test-commonjs',
    extends: './packages/test-commonjs/vite.config.js',
    test: {
      name: 'commonjs-playwright',
      include: ['tests/playwright/**/*.feature'],
      setupFiles: ['tests/playwright.steps.js'],
      testTimeout: 5000,
    }
  }
])