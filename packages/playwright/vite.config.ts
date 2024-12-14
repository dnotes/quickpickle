import { defineConfig } from 'vite';
import { quickpickle } from 'quickpickle';

// @ts-ignore
export default defineConfig({
  plugins: [
    // @ts-ignore
    quickpickle({
      failTags: ['fails', 'should-fail'],
      explodeTags: [
        ['nojs','js'],
        ['chromium','firefox','webkit'],
        ['mobile','tablet','desktop','widescreen'],
      ],
      worldConfig: {
        slowMoMs: 500,
      }
    }),
  ],
  test: {
    testTimeout: 10000,
    include: [
      'tests/**/*.feature'
    ],
    setupFiles: [
      './src/world.ts',
      './src/actions.steps.ts',
      './src/outcomes.steps.ts',
      './tests/playwright.steps.ts'
    ],
  },
});
