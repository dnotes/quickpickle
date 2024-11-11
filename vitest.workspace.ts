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
        screenshotDir: 'packages/playwright/screenshots',
      }
    }
  }
])