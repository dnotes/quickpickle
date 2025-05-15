# quickpickle

## 1.7.1

### Patch Changes

- 9145a9c: fixed types from last update

## 1.7.0

### Minor Changes

- 1cf8cca: update dependencies
- 1162c84: feat: added stepTimeout option for quickpickle

### Patch Changes

- 2e7530d: updating packages
- 094f7dd: rollup config and hoisting for vitest browser
- 7ad035c: fix: some errors would error when formatting stack

  In some environments, errors during step execution are
  not formatted correctly, leading to another error that
  is very unhelpful. This commit works around that problem.

- ab52cf6: fix: removed dependency on @cucumber/cucumber for DataTable

  The DataTable model from @cucumber/cucumber is now mirrored by
  QuickPickle because including it from the cucumber-js package
  brought all the test runner stuff with it, which was too big
  and messed up anything that tried to run in the browser.

## 1.6.2

### Patch Changes

- 156ee84: Use vite/vitest root directory for QuickPickle World projectRoot.
- 375fd69: Fix and optimize lodash imports for CommonJS

## 1.6.1

### Patch Changes

- 2626333: Render empty Features and Rules without errors.
- 4ce1543: added "data" property to World interface and variable
- d4d5717: Fix DataTables and DocStrings replacements in Scenario Outlines

## 1.6.0

### Minor Changes

- 2611f1d: Added support for [custom parameter types], exactly as in CucumberJS.
  A simple example:

  ```ts
  // Step definition file
  defineParameterType({
    name: "updown",
    regexp: /(up|down)/,
  });
  Given("a number {int}", (world, num) => {
    world.number = num;
  });
  When("the number goes {updown} {int}", (world, updown, num) => {
    if (updown === "up") world.number += num;
    else world.number -= num;
  });
  Then("the number should be {int}", (world, num) => {
    expect(world.number).toBe(num);
  });
  ```

  ```gherkin
  Feature: Custom parameter types
    Scenario: The number
      Given a number 4
      When the number goes up 5
      Then the number should be 9
  ```

  [custom parameter types]: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/api_reference.md#defineparametertypename-preferforregexpmatch-regexp-transformer-useforsnippets

### Patch Changes

- a28faaa: Snippets are now well supported, producing async/await javascript with appropriate variables.
- 0ddc22b: moved readme file for npmjs.com

## 1.5.5

### Patch Changes

- 3241e3e: remove console.log()s. /oops

## 1.5.4

### Patch Changes

- a5742b4: Fix tagged hooks to match [@cucumber/cucumber implementation].
  Tagged hooks are hooks that only run in the context of certain tags;
  for example, a BeforeAll hook that only starts the server for
  Features tagged with "@server".

  This change also adds info about the Feature to the "common" variable.

  [@cucumber/cucumber implementation]: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/hooks.md

## 1.5.3

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

- dee9d4b: Fixed errors in the hook implementations.

## 1.5.2

### Patch Changes

- 2bb4509: Fixed several errors in rendering, including:

  - \`Backticks` and ${variables} were not escaped properly in Scenario Outlines
  - Backslashes were not escaped properly in other strings

## 1.5.1

### Patch Changes

- db82746: Fixed problems with Scenario Outline rendering; under the following conditions,
  and probably some others, the renderer would fail.

  - If a parameter were named "context"
  - Any regex characters (e.g. \*) in a parameter name
  - Having a ton of examples
  - If a parameter name started with a number

## 1.5.0

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
