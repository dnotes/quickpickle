# quickpickle

## 1.4.0

### Minor Changes

- 4e4a90f: feat: add tags to test names for Vitest readouts

## 1.3.0

### Minor Changes

- f350d15: - changed tagsMatch API for QuickPickleWorldInterface -- it now returns string[] or null,
  which makes it easier for other plugins to get matching tags from a list.

  - added browser sizes to PlaywrightWorld; they can be chosen with tags or set via a Gherkin step.

- 94902af: feat: several additions to QuickPickleWorldInterface, fix explodeTags, refactor

  feat: add QuickPickleWorld.toString() function that renders to a single descriptive line
  feat: add QuickPickleWorld.info.stepIdx, to get the line number of the step within the scenario
  feat: add QuickPickleWorld.info.explodedIdx, to get the index number for exploded tags
  chore: renamed "qp" function to "gherkinStep", for better readability in traces
  fix: fixed the explodeTags functionality when rendering
  test: added tons of tests for the explodeTags functionality

## 1.2.4

### Patch Changes

- aa3d7f3: Added vitest as peer dependency

## 1.2.3

### Patch Changes

- ed86abd: feat(main): changes for playwright completion

  feat: added tagsMatch to default world object
  feat: added index for "exploded" tags as decimal on info.line
  test: updated tests for decimal line numbers
  fix: fixed circular dependency between index.ts and render.ts

## 1.2.2

### Patch Changes

- b3f2ba4: Fixed config inheritance
- 3eacaac: allow "exploding" tags (tags that make multiple tests for each combination)

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
