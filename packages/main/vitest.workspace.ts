import { defineWorkspace, defineProject } from 'vitest/config';

export default defineWorkspace([
  {
    extends: './vite.config.ts',
    test: {
      name: 'features',
      include : [ 'tests/*.feature' ],
      setupFiles: [ 'tests/tests.steps.ts' ],
    },
  },
  {
    extends: './vite.config.ts',
    test: {
      name: 'hooks',
      include : [ 'tests/hooks/*.feature' ],
      setupFiles: [ 'tests/tests.steps.ts','tests/hooks/hooks.steps.ts' ],
    },
  },
  {
    test: {
      name: 'unit',
      include : [ './tests/*.test.ts' ],
    }
  },
])
