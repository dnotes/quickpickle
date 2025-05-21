import { svelte } from '@sveltejs/vite-plugin-svelte';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import path from 'path'

const showBrowser = process.env.SHOW_BROWSER ? true : false;

export default [
{
  name: 'svelte',
  extends: `vite.config.ts`,
  plugins: [svelte()],
  test: {
    name: 'svelte',
    include: [ `tests/svelte/*.feature`, `tests/generic/*.feature` ],
    setupFiles: [ `src/frameworks/svelte.ts`, 'src/actions.steps.ts', 'src/outcomes.steps.ts', 'tests/generic/generic.steps.ts' ],
    quickpickle: {
      worldConfig: {
        componentDir: 'tests/svelte',
        screenshotDir: 'tests/svelte/screenshots',
      }
    },
    environment: 'browser',
    browser: {
      enabled: true,
      screenshotFailures: false,
      name: 'chromium',
      provider: 'playwright',
      ui: showBrowser,
      headless: !showBrowser,
      instances: [
        { browser:'chromium' },
      ]
    }
  }
},
// {
//   name: 'react',
//   extends: 'vite.config.ts',
//   plugins: [react()],
//   test: {
//     name: 'react',
//     include: [ 'tests/react/*.feature' ],
//     setupFiles: [ 'src/frameworks/react.ts', 'src/actions.steps.ts', 'src/outcomes.steps.ts' ],
//     quickpickle: {
//       worldConfig: {
//         componentDir: 'tests/react',
//         screenshotDir: 'tests/react/screenshots',
//       }
//     },
//     environment: 'browser',
//     browser: {
//       enabled: true,
//       screenshotFailures: false,
//       name: 'chromium',
//       provider: 'playwright',
//       ui: showBrowser,
//       headless: !showBrowser,
//       instances: [
//         { browser:'chromium' },
//       ]
//     }
//   }
// },
{
  name: 'vue',
  extends: 'vite.config.ts',
  plugins: [vue()],
  test: {
    name: 'vue',
    include: [ 'tests/vue/*.feature' ],
    setupFiles: [ 'src/frameworks/vue.ts', 'src/actions.steps.ts', 'src/outcomes.steps.ts' ],
    quickpickle: {
      worldConfig: {
        componentDir: 'tests/vue',
        screenshotDir: 'tests/vue/screenshots',
      }
    },
    environment: 'browser',
    browser: {
      enabled: true,
      screenshotFailures: false,
      name: 'chromium',
      provider: 'playwright',
      ui: showBrowser,
      headless: !showBrowser,
      instances: [
        { browser:'chromium' },
      ]
    }
  }
}
]

