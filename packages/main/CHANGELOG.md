# quickpickle

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
