# @quickpickle/playwright

## 0.9.8

### Patch Changes

- f1167dc: fixed outcomes step definitions and tests for static HTML page
- f350d15: - changed tagsMatch API for QuickPickleWorldInterface -- it now returns string[] or null,
  which makes it easier for other plugins to get matching tags from a list.

  - added browser sizes to PlaywrightWorld; they can be chosen with tags or set via a Gherkin step.

- 07920cd: fixed all action step definitions, with tests
- c85e2c0: Fixed file paths for default screenshots
- Updated dependencies [f350d15]
- Updated dependencies [94902af]
  - quickpickle@1.3.0

## 0.9.7

### Patch Changes

- 920abb4: fixed dependencies and added documentation
- Updated dependencies [aa3d7f3]
  - quickpickle@1.2.4

## 0.9.6

### Patch Changes

- 24428ba: Reorganization of outcomes steps.

## 0.9.5

### Patch Changes

- 120d2eb: feat(playwright): file loading, snapshots, and browsers (oh my!)

  feat: added basic visual regression testing
  feat: added choice of browser: chromium, firefox, webkit
  feat: added options: - host: the base url host - port: the base url port - screenshotDir: the directory for sceenshots - nojsTags: tags to start the browser without js - showBrowserTags: tags to show a browser for that test - slowMoTags: tags to run that test with slowMo enabled - slowMoMs: number of milliseconds to run slowMo
  feat: added world.baseUrl getter
  fix: remove timeouts for all step defintions (use slowmo instead)
  fix: fixed expression for outcome step "I should see {string} element with {string}"
  feat: added outcome step "the user agent should contain/be {string}"
  feat: added outcome step "the screenshot should match"
  feat: added outcome step "the screenshot {string} should match"
  fix: make the action steps for navigation respect the config
  feat: added action step "I load the file {string}"
  fix: fixed the screenshot steps

  test: added test html files for faster loading
  test: removed old tests dependent on internet
  test: tests for concurrent testing in different browsers
  test: tests for showing brorwser and slowmo
  test: tests for visual regression testing

- Updated dependencies [ed86abd]
  - quickpickle@1.2.3

## 0.9.4

### Patch Changes

- Updated dependencies [b3f2ba4]
- Updated dependencies [3eacaac]
  - quickpickle@1.2.2

## 0.9.3

### Patch Changes

- cf2fd4d: fixed worldConfig options headless and slowMo

## 0.9.2

### Patch Changes

- b8a6860: fix package.json for files exports
- Updated dependencies [e23b37b]
  - quickpickle@1.2.1

## 0.9.1

### Patch Changes

- 8f5f661: Release playwright extension, and many fixes to make it work.
- Updated dependencies [8f5f661]
  - quickpickle@1.2.0
