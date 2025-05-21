# Vitest: Browser Mode

This is the library for using Vitest with browser mode for testing components.
It's still fairly early in development, but you can already use it for some purposes.

## Setup

The following is a pretty basic setup for testing components in Svelte, Vue, or React:

1. `pnpm i -D @quickpickle/vitest-browser@latest`

2. add plugins to the Vitest configuration, in one of the configuration files (`vite.config.ts`, `vitest.config.ts`, or `vitest.workspace.ts`). Here is a working example from a SvelteKit project:

    ```ts
    // File: vitest.workspace.ts
    import quickpickle from "quickpickle";

    export default [
      {
        plugins: [quickpickle()],
        extends: './vite.config.ts',
        test: {
          name: 'components',
          environment: 'browser',
          include: ['src/lib/**/*.feature'], // anticipates putting the .feature files next to components
          setupFiles: ['./tests/components.steps.ts'], // this file must be created (see step 3)
          // @ts-ignore
          quickpickle: {
            worldConfig: {
              componentDir: 'src/lib', // The directory where the components are kept
            }
          },
          browser: { // This is configuration for Vitest browser mode, and can be modified as appropriate
            enabled: true,
            screenshotFailures: true,
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
    ```

3. Create a step definition file for your component tests:

    ```ts
    // File: tests/components.steps.ts
    import '@quickpickle/vitest-browser/actions';
    import '@quickpickle/vitest-browser/outcomes';
    import '@quickpickle/vitest-browser/svelte'; // OR react or vue
    ```

## Known Issues:

* Reactivity is currently broken for Svelte and Vue tests.
* Screenshot comparisons don't work yet.
* Selecting elements by css selector doesn't work yet.

## Suspected Issues:

* I suspect that there will still be issues with the test code
  not properly waiting for changes to propagate on the page when
  there are delays for CSS transitions, async fetch calls, etc.

## Plans:

[x] basic actions and outcomes in English, to match @quickpickle/playwright
[x] basic tests for rendering Svelte, Vue, and React components
[ ] full tests for all actions and outcomes, matching @quickpickle/playwright
[ ] some sort of Storybook-esque presentation using Vitest UI