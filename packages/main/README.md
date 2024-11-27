# QuickPickle

QuickPickle is a plugin for [Vitest] to run tests written in [Gherkin Syntax].
It seamlessly integrates Gherkin Feature files into your Vitest testing workflow
by parsing them with the official [Gherkin Parser] and running them as Vitest tests.

## Features

- Seamless integration of Gherkin Feature files into Vitest testing workflow
- Full support for Gherkin 6, using the official [Gherkin Parser]
- Full ESM, typescript and javascript support (because it's Vitest)
- Vitest-native test extensions concurrent, sequential, skip, todo, and fails
- Multiple test environments with vitest.workspace configurations
- Custom world constructors, similar to CucumberJS

### CucumberJS Feature List

- [x] Full [Gherkin 6] support
- [x] Step definitions using [Cucumber Expressions] or Regex
- [x] [setWorldConstructor]: custom world constructor
- [x] [hooks]: BeforeAll, Before, BeforeStep, AfterStep, After, AfterAll
- [x] [named hooks]
- [x] [tagged hooks]
- [x] [skipping in a before hook]: *(use [world.context.skip()])*
- [x] [defineParameterType] for custom parameter types in Cucumber Expressions
- [x] [setDefaultTimeout] *(use [testTimeout] in Vitest config)*
- [x] [setDefinitionFunctionWrapper] *(use Before and After hooks)*
- [x] [setParallelCanAssign] *(use @concurrent and @sequential [special tags])*
- [ ] attachments with [world.attach], [world.log], and [world.link] *not supported, use Vitest reporters*
- [x] [DataTables] fully implemented, with full [DataTable interface]
- [x] [DocStrings] fully implemented, with mediaType support
- [x] [debugging] *(use [Vitest debugging])*
- [x] [dry run] *not precisely supported, but you can use `vitest list` for something similar*
- [x] [esm] **100% support through Vite (the reason for this package)**
- [x] [fail fast] *(use [bail option] in Vitest config or command run, e.g. `vitest --bail=1`)*
- [x] [filtering] partial support *(use [testNamePattern] to run tests matching a regex pattern)*
- [x] [formatters] *(use Vitest [reporters])*
- [x] [parallel] *(use `@parellel` and `@sequential` [special tags])*
- [x] [profiles] *(use Vitest [workspaces])*
- [x] [rerun] *(press "f" in [watch mode terminal])*
- [x] [retry] *(use Vitest [retry option])*
- [x] [snippets] *(only async/await javascript is supported)*
- [x] [transpiling] **100% support through Vite (the reason for this package)**

[Gherkin 6]: https://cucumber.io/docs/gherkin/reference/
[Cucumber Expressions]: https://github.com/cucumber/cucumber-expressions#readme
[setWorldConstructor]: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/world.md
[hooks]: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/hooks.md
[named hooks]: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/hooks.md#named-hooks
[tagged hooks]: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/hooks.md#tagged-hooks
[skipping in a before hook]: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/hooks.md#skipping-in-a-before-hook
[world.context.skip()]: https://vitest.dev/guide/test-context.html#context-skip
[defineParameterType]: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/api_reference.md#defineparametertypename-preferforregexpmatch-regexp-transformer-useforsnippets
[setDefaultTimeout]: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/api_reference.md#setdefaulttimeoutmilliseconds
[testTimeout]: https://vitest.dev/guide/cli-generated.html#testtimeout
[setDefinitionFunctionWrapper]: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/api_reference.md#setdefinitionfunctionwrapperwrapper
[setParallelCanAssign]: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/api_reference.md#setparallelcanassigncanassignfn
[world.attach]: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/attachments.md
[world.log]: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/attachments.md#logging
[world.link]: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/attachments.md#links
[DataTables]: https://cucumber.io/docs/gherkin/reference#data-tables
[DataTable interface]:  https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/data_table_interface.md
[DocStrings]: https://cucumber.io/docs/gherkin/reference#doc-strings
[debugging]: https://github.com/cucumber/cucumber-js/blob/main/docs/debugging.md
[Vitest debugging]: https://vitest.dev/guide/debugging.html
[dry run]: https://github.com/cucumber/cucumber-js/blob/main/docs/dry_run.md
[esm]: https://github.com/cucumber/cucumber-js/blob/main/docs/esm.md
[fail fast]: https://github.com/cucumber/cucumber-js/blob/main/docs/fail_fast.md
[bail option]: https://vitest.dev/config/#bail
[filtering]: https://github.com/cucumber/cucumber-js/blob/main/docs/filtering.md
[testNamePattern]: https://vitest.dev/guide/cli.html#testnamepattern
[formatters]: https://github.com/cucumber/cucumber-js/blob/main/docs/formatters.md
[reporters]: https://vitest.dev/guide/reporters.html
[parallel]: https://github.com/cucumber/cucumber-js/blob/main/docs/parallel.md
[profiles]: https://github.com/cucumber/cucumber-js/blob/main/docs/profiles.md
[workspaces]: https://vitest.dev/guide/#workspaces-support
[retry]: https://github.com/cucumber/cucumber-js/blob/main/docs/retry.md
[rerun]: https://github.com/cucumber/cucumber-js/blob/main/docs/rerun.md
[retry option]: https://vitest.dev/guide/cli-generated.html#retry
[watch mode terminal]: https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/node/stdin.ts
[snippets]: https://github.com/cucumber/cucumber-js/blob/main/docs/snippets.md
[transpiling]: https://github.com/cucumber/cucumber-js/blob/main/docs/transpiling.md
[PLANNED]: #planned-for-feature-completeness

### Benefits of Gherkin

- Write tests in plain English (or your team's language)

  Because it uses natural language, Gherkin Syntax enables all stakeholders to
  understand and contribute to tests, and having a common vocabulary to describe
  functionality makes it easy to agree on and verify what the program does.

- Reuse test step definitions to minimize test code

  Bugs can happen even in test code, so it's best if the test code changes as seldom
  as possible, but functionality changes all the time. A small library of reusable step
  definitions is much easier to maintain than a large corpus of test code.

### Goals of QuickPickle

1.  Support the main technical ideas behind Gherkin / Cucumber

    - Natural language for features
    - Discrete, re-usable step definitions

2.  Make Gherkin tests easy to set up and use in Javascript projects

    - [x] Run tests with Vitest, to avoid painful snafus from js/ts/esm/commonjs issues.
    - [x] Provide a plugin for testing web applications. (completed with [packages/playwright])
    - [ ] Provide a plugin for testing components. (in progress with [packages/components])

3.  Experiment with means of supporting open-source projects

    - [ ] Provide a Svelte component exposing Gherkin steps, so that end users can potentially
      write bug reports and feature requests in the form of Gherkin scenarios. (in progress with
      [packages/svelte])
    - [ ] Provide a GitHub actions and/or bots that interface with AI to:
      - write Gherkin scenarios based on issue reports
      - write code based on Gherkin scenarios

4.  Experiment with Gherkin for unsanctioned testing purposes

    **Note:** These ideas do NOT align with Cucumber best practices; use at your own risk
    (of being ridiculed on reddit, etc.)

    - [ ] **Develop a library of common step definitions that could be used across projects to test
      UI interaction:** Gherkin scenarios and steps should generally be written with domain-specific
      language instead of focusing on the user interface (see the "Lots of user interface details"
      section of [Cucumber Anti-Patterns]). However:

      1.  The browser is a specific domain that is nonetheless common across all web projects;
          most will need an "I navigate to {string}" step.
      2.  There may be a benefit to having a well-written set of Gherkin steps for UI testing
          that is re-usable across a wide range of projects.
      3.  This would make it _really_ easy for people to get started, even without writing any
          step definitions.

      (in progress with [packages/playwright])

    - [ ] **Develop a library of common step definitions that could be used across projects for
      "unit testing" components:** Gherkin is meant for testing the behavior of an application,
      not the code, and in most cases it is not a good tool for unit testing. However:

      1.  In some ways components represent units of behavior, often containing minimal code.
      2.  It might be beneficial to have a library of well-written Gherkin steps for testing
          every type of interaction that it supports.

      (in progress with [packages/components])

## Installation

```sh
npm install --save-dev quickpickle vitest
```

## Configuration

To get QuickPickle working you'll need to do three things:

1.  configure Vitest to use QuickPickle, in vite.config.ts or vitest.workspace.ts
2.  create a step definition file to
    - import or create your step definitions
    - set a different world variable constructor (optional)
3.  install & configure VSCode Cucumber plugin (optional but highly recommended)

### QuickPickle configuration in Vitest

Add the quickpickle plugin to your Vitest configuration in vite.config.ts (or .js, etc.).
Also add the configuration to get the feature files, step definitions, world file, etc.

```ts
// vite.config.ts
import { quickpickle } from 'quickpickle';

export default {
  plugins: [
    quickpickle() // <-- Add the quickpickle plugin
  ],
  test: {
    include : [
      'features/*.feature', // <-- Add Gherkin feature files into "test" configuration
      // (you'll probably want other test files too, for unit tests etc.)
    ],
    setupFiles: ['./tests/tests.steps.ts'] // <-- specify each setupfile here
  },
};
```

If you have multiple configurations, you can also add the test settings in vitest.workspace.ts.
This is also where you could set up separate configurations for components vs. application,
different browser environments, different world constructors, etc.

```ts
// vitest.workspace.ts
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  { // configuration for feature files testing the application
    extends: './vite.config.ts',
    test: {
      include : [ 'tests/*.feature' ],
      setupFiles: [ 'tests/tests.steps.ts' ],
    },
  },
  { // a second configuration for feature files testing components
    extends: './vite.config.ts',
    test: {
      include : [ 'src/lib/*.feature' ],
      setupFiles: [ 'tests/components.steps.ts' ],
    },
  },
  { // configuration for unit tests
    test: {
      include : [ 'tests/*.test.ts' ],
    }
  }
])
```

### Step definition file

You'll always need a step definition file, to set up the step defintions and potentially the world
variable constructor. Here is an exmaple if you want to use @quickpickle/playwright to test web sites:

```ts
// tests/example.steps.ts
import '@quickpickle/playwright/actions' // <-- import action step definitions from @quickpickle/playwright
import '@quickpickle/playwright/outcomes' // <-- import outcome step definitions from @quickpickle/playwright

import '@quickpickle/playwright/world' // <-- use the playwright world variable (optional)

import { Given, When, Then } from 'quickpickle' // <-- the functions to write step definitions

// Custom step definitions
Given('a/another number {int}', async (world) => {
  if (!world.numbers) world.numbers = []
  world.numbers.push(int)
})
```

### Cucumber plugin for VSCode

If you use VSCode, you'll want a cucumber plugin for code completion when
writing gherkin features. Try the official "Cucumber" plugin, by "Cucumber".
You'll also need to configure it so that it sees your step definitions.

```json
// VSCode settings.json
"cucumber.glue": [
    "**/*.steps.{ts,js,mjs}",
    "**/steps/*.{ts,js,mjs}"
],
```

## Usage

### Write Feature files

Write your feature files in the directory specified above. Common convention
is to place feature files in a "features" directory, though some prefer the
"tests" directory. You can put them anywhere as long as they're listed in the
"include" configuration in vite.config.ts.

```gherkin
# features/example.feature
Feature: A simple example

  Scenario: Adding numbers
    Given a number 1
    And a number 2
    And a number 3
    And another number 3
    Then the sum should be 9
```

### Run tests

```sh
npx vitest --run
```

### Write step definitions

Write your step definitions in a typescript or javascript file as configured
in the "setupFiles" declaration in your vitest config.

These files will be imported into the Vitest test runner, and the code for
`Given`, `When`, `Then` will register each of the step definitions with quickpickle.
These step definitions should run immediately, i.e. at the top level of the script,
not as exported functions like a normal node module would do.

```ts
// features/example.steps.ts
import { Given, Then } from 'quickpickle'

Given('a/another number {int}', (world, int) => {
  if (!world.numbers) world.numbers = [int]
  else world.numbers.push(int)
})

Then('the sum should be {int}', (world, int) => {
  expect(world.numbers.reduce((a,b) => a + b, 0)).toBe(int)
})
```

### Define a custom "world" variable constructor

To define a custom world variable constructor in QuickPickle, you can use the `setWorldConstructor`
function exported from the package. This allows you to create a custom World class that extends the
QuickPickleWorld interface, enabling you to add your own properties and methods to the world object.
By setting up a custom world constructor, you can initialize specific data or services that will be
available to all your step definitions throughout the test execution.

Each Scenario will receive a new instance of the world variable based on this class. If you need
to write asynchronous code, you can write it inside an "init" function. Here is an example that
should set up a sqlite database and initiate it with a "users" table:

```ts
import { setWorldConstructor, QuickPickleWorld, QuickPickleWorldInterface } from 'quickpickle'
import sqlite3 from 'sqlite3'
import { Database, open } from 'sqlite'

class CustomWorld extends QuickPickleWorld {
  db?: Database;

  constructor(context: TestContext, info?: QuickPickleWorldInterface['info']) {
    super(context, info)
  }

  async init() {
    await super.init()
    this.db = await this.setupDatabase()
  }

  private async setupDatabase(): Promise<Database> {
    const db = await open({
      filename: ':memory:',
      driver: sqlite3.Database
    })

    await db.exec(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)`)

    return db
  }
}

setWorldConstructor(CustomWorld)
```

For a real world example of a custom world constructor, see [PlaywrightWorld.ts].

### Run Gherkin tests in your CI workflow

If Vite is properly configured, Gherkin tests should run the same on local environments
as it does in your CI workflow. If you use browser testing tools like Playwright, you
may need to take a step to set it up first.

See quickpickle's [release.yml] for an example.

## Differences from CucumberJS

The main library for Gherkin in the JS ecosystem is [CucumberJS],
a test runner written explicitly for Gherkin tests. QuickPickle aims to be
a complete replacement for that library, using Vite to handle bundling
and test running while maintaining functional parity with the original.
Nonetheless, there are differences. Here are the important ones that have
come to notice:

### `world` replaces `this` in step definitions

  Each step definition in QuickPickle receives a "world" variable as its first parameter.

  ```ts
  // QuickPickle step definition
  Given('a number {int}', function(world:QuickPickleWorldInterface, int:number) {
    if (!Array.isArray(world.numbers)) world.numbers = [int]
    else world.numbers.push(int)
  })
  ```

  In CucumberJS, you would write your step definitions using "this":

  ```ts
  // CucumberJS step definition
  Given('a number {int}', function(int:number) {
    if (!Array.isArray(this.numbers)) this.numbers = [int]
    else this.numbers.push(int)
  })
  ```

  Aside from the fact that a passed variable is much easier to think about for a compiler
  than custom bindings, `this` led to some sub-optimal usage in modern Javascript, including:

  - Arrow functions couldn't be used in step definitions or hooks, or `this` wouldn't work.
  - When using a custom world, you would have to add `(this:CustomWorldType, ...params)`
    in typescript files or else you wouldn't get the right types.

  Passing a variable is clearer and more intuitive, and provides more reliable support for
  modern JS.

### Current step info in world variable

  In CucumberJS, the default world variable contains information about the test *suite*,
  but not the *current step*. In QuickPickle, the "world" variable passed to each test step
  contains an "info" property with the data about the Scenario.

  ```ts
  export interface QuickPickleWorldInterface {
    info: {
      config: QuickPickleConfig   // the configuration for QuickPickle
      feature: string             // the Feature name (not file name)
      scenario: string            // the Scenario name
      tags: string[]              // the tags for the Scenario, including tags for the Feature and/or Rule
      steps: string[]             // an array of all Steps in the current Scenario
      stepIdx?: number            // the index of the current Step, starting from 1 (not 0)
      rule?: string               // the Rule name, if any
      step?: string               // the current Step
      line?: number               // the line number, in the file, of the current Step
      explodedIdx?: number        // the index of the test case, if exploded, starting from 1 (not 0)
      errors: any[]               // an array of errors that have occurred, if the Scenario is tagged for soft failure
    }
    context: TestContext,         // the Vitest context
    isComplete: boolean           // (read only) whether the Scenario is on the last step
    config: QuickPickleConfig                       // (read only) configuration for QuickPickle
    worldConfig: QuickPickleConfig['worldConfig']   // (read only) configuration for the World
    common: {[key: string]: any}                    // Common data shared across tests --- USE SPARINGLY
    init: () => Promise<void>                       // function called by QuickPickle when the world is created
    tagsMatch(tags: string[]): string[]|null        // function to check if the Scenario tags match the given tags
  }
  ```

### Special Tags

  In Gherkin, the meanings of tags are determined by the implementation, there are no defaults.
  Since quickpickle uses Vitest, some tags have been given default meanings:

  * `@todo` / `@wip`: Marks scenarios as "todo" using Vitest's test.todo implementation
  * `@skip`: Skips scenarios using Vitest's test.skip implementation
  * `@fails` / `@failing`: Ensures that a scenario fails using Vitest's test.fails implementation
  * `@concurrent`: Runs scenarios in parallel using Vitest's test.concurrent implementation
  * `@sequential`: Runs scenarios sequentially using Vitest's test.sequential implementation

  The relevant tags can be configured. Plugins may also have default tag implementations; for example,
  @quickpickle/playwright has `@nojs` to disable javascript, and `@chromium`, `@firefox`, and `@webkit`
  to run a scenario on a particular browser.

### Unsupported CucumberJS Features

- return "skipped" in step definitions or hooks to skip a step definition or hook *(use `world.context.skip()`)*
- [setDefaultTimeout] *(use [testTimeout] in Vitest config)*
- [setDefinitionFunctionWrapper] *(use Before and After hooks)*
- [setParallelCanAssign] *(use @concurrent and @sequential [special tags])*
- attachments with [world.attach], [world.log], and [world.link] *not supported, use Vitest [reporters]*
- [dry run] *not supported, but you can use `vitest list` which is similar*
- [custom snippet formats] *(only async/await javascript is supported)*
- [filtering] CucumberJS tag matching with "and", "not", etc.
  In Vitest it is only possible to match the name of the test. With QuickPickle tests
  the name does include the tags, so running `vitest -t "@some-tag"` does work, but
  you can't specify that it should run all tests *without* a certain tag.

## Acknowledgements

This project started out as a fork of [vitest-cucumber-plugin] by Sam Ziegler.
It's been almost completely rewritten in the following ways:

- it has been converted to typescript
- a custom Gherkin parser has been replaced with the official [Gherkin Parser]
- the step definition format has been reverted to more closely match CucumberJS

Nonetheless, the brilliant ideas behind the original plugin are still present
in the architecture of this project. Thanks Sam, your work blew my mind.

!["it's so simple!" - Owen Wilson from Zoolander peers over an early 2000s iMac computer, a mad glint in his eye.](https://www.memecreator.org/static/images/memes/5439760.jpg)

## Media and Tutorials

* [Behavioral testing with Gherkin and SvelteKit](https://www.youtube.com/watch?v=fAPFsRP-mbc&t=1080s): The Svelte Summit presentation from 19 October 2024.

  * What is Gherkin / Cucumber and why should you use it
  * Comparing Gherkin to straight Playwright code
  * Testing the Svelte "Sverdle" app that ships with the demo site
  * Adding a new feature using Behavior Driven Development assisted by AI

* [QuickPickle dev vlog 27 Oct. 2024](https://www.youtube.com/watch?v=aNRq3MXlTJQ):
  A near-real-time exploration of QuickPickle for beginners, highlighting Playwright functionality.

  * How to set up QuickPickle for testing websites with Playwright
  * Testing with and without Javascript, in multiple browsers, at multiple resolutions
  * Using QuickPickle's `explodeTags` to minimize test verbiage

* [QuickPickle dev vlog 19 Nov. 2024](https://youtu.be/lZqJyAm82os):
  Migrating a complex CucumberJS implementation to QuickPickle

  *tl;dr:*
  * Set the proper configuration for vite / vitest
  * Change imports
  * Find and replace "this" to "world" in step definitions and hooks
  * Move your "setDefaultTimeout" to the vitest config "testTimeout"
  * Make any necessary changes in your custom world constructor, if applicable



[Vitest]: https://vitest.dev/
[Gherkin Syntax]: https://cucumber.io/docs/gherkin/reference/
[Gherkin Parser]: https://www.npmjs.com/package/@cucumber/gherkin
[CucumberJS]: https://github.com/cucumber/cucumber-js
[vitest-cucumber-plugin]: https://github.com/samuel-ziegler/vitest-cucumber-plugin
[PlaywrightWorld.ts]: https://github.com/dnotes/quickpickle/blob/main/packages/playwright/src/PlaywrightWorld.ts
[@quickpickle/playwright]: https://github.com/dnotes/quickpickle/tree/main/packages/playwright
[packages/playwright]: https://github.com/dnotes/quickpickle/tree/main/packages/playwright
[packages/components]: https://github.com/dnotes/quickpickle/tree/main/packages/components
[packages/svelte]: https://github.com/dnotes/quickpickle/tree/main/packages/svelte
[release.yml]: https://github.com/dnotes/quickpickle/blob/main/.github/workflows/release.yml
[special tags]: #special-tags