# [Svelte CLI](https://svelte.dev/docs/cli/overview) community add-on: `@quickpickle/sv`

This 

## Usage

To install the add-on, run:

```shell
npx sv add @quickpickle
```

## What you get

- Installs QuickPickle and Playwright integrations for behavioral testing:
  - `quickpickle`
  - `@quickpickle/playwright`
  - `vitest`
  - `playwright`
- Adds test scripts in `package.json`:
  - `test`
  - `test:e2e`
- Creates e2e starter files:
  - `vitest.config.e2e.{js|ts}`
  - `tests/e2e.steps.{js|ts}`
  - `tests/front.feature`
- Updates `.vscode/settings.json` with Cucumber autocomplete settings.
- Updates `vite.config.{js|ts}` test config to include the e2e project.

## Options

This add-on currently has no user-facing options.

## Quick start

After applying the add-on, run:

```shell
pnpm test:e2e
```
