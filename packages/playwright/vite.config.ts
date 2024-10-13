import { defineConfig } from 'vite';
import { quickpickle } from 'quickpickle';

// @ts-ignore
export default defineConfig({
  plugins: [
    // @ts-ignore
    quickpickle({
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
    setupFiles: ['./src/world.ts', './src/actions.steps.ts','./src/outcomes.steps.ts'],
  },
});
