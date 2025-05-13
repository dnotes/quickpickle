import { svelte } from '@sveltejs/vite-plugin-svelte';

export default [
{
  name: 'svelte',
  extends: 'vite.config.ts',
  plugins: [svelte()],
  test: {
    name: 'vitest-browser-svelte',
    include: [ 'tests/svelte/*.feature' ],
    setupFiles: [ 'src/frameworks/svelte.ts', 'src/actions.steps.ts', 'src/outcomes.steps.ts' ],
    quickpickle: {
      worldConfig: {
        componentDir: 'tests/svelte',
      }
    },
    environment: 'browser',
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
      ui: true,
      instances: [
        { browser:'chromium' },
      ]
    }
  }
},
]


