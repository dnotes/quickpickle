# @quickpickle/playwright

## 0.14.0

### Minor Changes

- cdc087d: Use the new custom screenshot comparison engine from VisualWorld.
  IMPORTANT: This upgrade may result in minor changes to existing visual regression baselines.
- 596516b: Added an "AriaRole" parameter type, matching all Aria roles
  as well as the quickpickle-specific extensions "input" and "element"

  @quickpickle/playwright now uses this matcher instead of {word} for
  matching visual elements on the page.

- 1619ff4: Added a "weight" property to Hooks for ordering.

  @quickpickle/playwright uses the new weight property to ensure that
  its After hook gets run last (weight:99), so that there will still
  be a browser in other After hooks. The upshot of this is that now
  you can write hooks like the following, which takes a screenshot
  after any Scenario with the proper tag:

  ```ts
  After("@screenshot", async (world: PlaywrightWorld) => {
    await world.screenshot();
  });
  ```

- cead779: This release adds new interfaces and world constructor class for a "VisualWorld"
  to QuickPickle main library. All visual testing libraries (Playwright, Vitest Browser)
  should implement the VisualWorldInterface, and may extend the VisualWorld class,
  which encapsulates helpful functionality for screenshots.

### Patch Changes

- 3afe782: Fix the improper error messages in expectText and expectElement
- 093d3eb: Marking playwright expect.toMatchScreenshot() as deprecated
- Updated dependencies [f14aafc]
- Updated dependencies [596516b]
- Updated dependencies [1619ff4]
- Updated dependencies [cead779]
  - quickpickle@1.10.0

## 0.13.1

### Patch Changes

- Updated dependencies [e617638]
  - quickpickle@1.9.0

## 0.13.0

### Minor Changes

- 8a32a09: Add a true path sanitizer to the base World object

  BREAKING CHANGE:

  The base world object no longer has a public `projectRoot` property.
  Instead of constructing paths that way, developers should use the
  `world.fullPath()` method to get the full path to a file or subfolder.
  This should ensure that only files below the projectRoot are accessed.

  Playwright and Browser world constructors no longer have the
  sanitizeFilepath method. Instead, there is a new "sanitizePath"
  method on the base World, which should be relatively safe even
  for user input, avoiding path traversal and the like.

### Patch Changes

- Updated dependencies [8a32a09]
  - quickpickle@1.8.0

## 0.12.1

### Patch Changes

- 9145a9c: fixed types from last update
- Updated dependencies [9145a9c]
  - quickpickle@1.7.1

## 0.12.0

### Minor Changes

- 1cf8cca: update dependencies

### Patch Changes

- 2e7530d: updating packages
- 094f7dd: rollup config and hoisting for vitest browser
- 159542b: fix playwright actions for typing keys
- Updated dependencies [2e7530d]
- Updated dependencies [094f7dd]
- Updated dependencies [7ad035c]
- Updated dependencies [1cf8cca]
- Updated dependencies [ab52cf6]
- Updated dependencies [1162c84]
  - quickpickle@1.7.0

## 0.11.2

### Patch Changes

- 156ee84: Use vite/vitest root directory for QuickPickle World projectRoot.
- 375fd69: Fix and optimize lodash imports for CommonJS
- Updated dependencies [156ee84]
- Updated dependencies [375fd69]
  - quickpickle@1.6.2

## 0.11.1

### Patch Changes

- 176dbdc: Fix the screenshot paths so they run on CI

## 0.11.0

### Minor Changes

- 63e01b5: Refactor for better playwright code
- a614266: added screenshot options to playwright world config

### Patch Changes

- 4859183: trying to fix the project root for saving screenshots
- Updated dependencies [2626333]
- Updated dependencies [4ce1543]
- Updated dependencies [d4d5717]
  - quickpickle@1.6.1

## 0.10.6

### Patch Changes

- a28faaa: Snippets are now well supported, producing async/await javascript with appropriate variables.
- Updated dependencies [a28faaa]
- Updated dependencies [2611f1d]
- Updated dependencies [0ddc22b]
  - quickpickle@1.6.0

## 0.10.5

### Patch Changes

- Updated dependencies [3241e3e]
  - quickpickle@1.5.5

## 0.10.4

### Patch Changes

- Updated dependencies [a5742b4]
  - quickpickle@1.5.4

## 0.10.3

### Patch Changes

- ffa86bf: Added common variable should to BeforeAll and AfterAll hooks.
  In your support files, you can get or set variables that should be
  common (shared) across all the tests in the Feature file.

  In general it is not good testing practice to use this for anything
  other than setup and teardown; for example, you might start a server
  and save the port in BeforeAll, then tear it down in AfterAll.

  Here is a ridiculous example demonstrating the functionality:

  ```ts
  import { BeforeAll, AfterAll, AfterStep } from "quickpickle";
  BeforeAll(async (common) => {
    common.totalSteps = 0;
  });
  AfterStep(async (world) => {
    world.common.totalSteps++;
  });
  AfterAll(async (common) => {
    expect(common.totalSteps).not.toBeFalsy();
  });
  ```

- Updated dependencies [ffa86bf]
- Updated dependencies [dee9d4b]
  - quickpickle@1.5.3

## 0.10.2

### Patch Changes

- Updated dependencies [2bb4509]
  - quickpickle@1.5.2

## 0.10.1

### Patch Changes

- Updated dependencies [db82746]
  - quickpickle@1.5.1

## 0.10.0

### Minor Changes

- 974e09d: ## Configuration of the world variable

  QuickPickle now handles setting up the WorldConfig for any world builder
  that extends the QuickPickleWorld class. That worldConfig is now accessable
  in world.info.config.worldConfig, and in the read-only getter world.worldConfig.

  The @quickpickle/playwright plugin has been updated to use the new API.

  Any world builder classes using the old API will continue to function as before
  for the time being.

  ## New API available for "soft" failure

  Occasionally you may want to allow a scenario to continue running even after
  a step has failed. Some use cases might be:

  - to check the nature of the error thrown in a previous step
  - to see all the errors from a longer list of steps
  - to take a screenshot if there are any errors

  There is now an API for this purpose: Scenarios can be tagged for "soft" failure.
  The default tags are "@soft" or "@softfail", which can be configured at "softFailTags".
  Scenarios tagged for soft failure will continue to run until the end of the Scenario,
  and the Before and After hooks will be run as well. Any errors will be collected in
  world.info.errors. If there are errors after the last step and After hooks have run,
  then the Scenario will fail.

  Note that this is analogous but slightly different from soft assertions in other
  test frameworks like Vitest and Playwright, in that if you don't clear out the
  accumulated errors, the Scenario will still fail at the end.

### Patch Changes

- 7f50c7d: added screenshots for elements, and fixed save location for visual regression tests
- 7fc2026: provide better error messages for metatag tests
- Updated dependencies [974e09d]
  - quickpickle@1.5.0

## 0.9.9

### Patch Changes

- Updated dependencies [4e4a90f]
  - quickpickle@1.4.0

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
