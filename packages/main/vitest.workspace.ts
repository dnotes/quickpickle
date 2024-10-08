import { defineWorkspace, defineProject } from 'vitest/config';

export default defineWorkspace([
  {
    extends: './vite.config.ts',
    test: {
      include : [ 'tests/*.feature' ],
      setupFiles: [ 'tests/tests.steps.ts' ],
    },
  },
  {
    test: {
      include : [ './tests/*.test.ts' ],
    }
  }
])
