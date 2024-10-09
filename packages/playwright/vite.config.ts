import { defineConfig } from 'vite';
import { quickpickle } from 'quickpickle';

export default defineConfig({
  plugins: [
    // @ts-ignore
    quickpickle(),
  ],
  test: {
    testTimeout: 10000,
    include: [
      'tests/**/*.feature'
    ],
    setupFiles: ['./src/world.ts', './src/actions.steps.ts','./src/outcomes.steps.ts'],
  },
});
