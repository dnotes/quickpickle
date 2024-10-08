import { defineWorkspace, defineProject } from 'vitest/config';

export default defineWorkspace([
  {
    root: './packages/main',
    extends: './packages/main/vite.config.ts',
    test: {
      include : [ './tests/*.feature' ],
      setupFiles: [ 'tests/tests.steps.ts' ],
    },
  },
  {
    root: './packages/main',
    extends: './packages/main/vite.config.ts',
    test: {
      include : [ 'tests/*.test.ts' ],
    }
  }
])
