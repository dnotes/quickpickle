# quickpickle

## 1.2.1

### Patch Changes

- e23b37b: Fixed types and config passing for vite plugin

## 1.2.0

### Minor Changes

- 8f5f661: Release playwright extension, and many fixes to make it work.

## 1.1.2

### Patch Changes

- e11bbcb: Added vitest test context to playwright as world.context.

## 1.1.1

### Patch Changes

- c7e9292: Fixed ensure all tags configs are normalized

## 1.1.0

### Minor Changes

- Added support for Vitest features through tags. Defaults are as follows:

  - '@todo' or '@wip' tags will use `test.todo`
  - '@skip' tags will use `test.skip`
  - '@fails' tag will use `test.fails`
  - '@concurrent' tag will use `test.concurrent`
  - '@sequential' tag will use `test.sequential`

  These can be configured in the config object passed to quickpickle.

## 1.0.0

### Major Changes

- Initial release of QuickPickle
