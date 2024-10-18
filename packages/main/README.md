# QuickPickle

QuickPickle is a plugin for [Vitest] to run tests written in [Gherkin Syntax].
It seamlessly integrates Gherkin Feature files into your Vitest testing workflow
by parsing them with the official [Gherkin Parser] and running them as Vitest tests.

## Features

- Seamless integration of Gherkin Feature files into Vitest testing workflow
- Full support for Gherkin 6, using the official [Gherkin Parser]
- Full typescript and javascript support (because it's really just Vitest)
- Supports Vitest-native test extensions concurrent, sequential, skip, todo, and fails
- Supports multiple test environments with vitest.workspace configurations
- Supports custom world constructors, similar to CucumberJS

### Benefits of Gherkin

- Write tests in plain English (or your team's language)

  Because it uses natural language, Gherkin Syntax enables all stakeholders to
  understand and contribute to tests, and having a common vocabulary to describe
  functionality makes it easy to agree on and verify what the program does.

- Reuse test step definitions to minimize test code

  Bugs can happen even in test code, so it's best if the test code changes as seldom
  as possible, but functionality changes all the time. A small library of reusable step
  definitions is much easier to maintain than a large corpus of test code.

### When NOT to use Gherkin

For unit tests, it's usually better to use plain Vitest or another testing framework.

## Installation

```sh
npm install --save-dev quickpickle vitest
```

## Configuration

To get QuickPickle working you'll need to do three things:

1.  configure Vitest to use QuickPickle, in vite.config.ts or vitest.workspace.ts
2.  create a step definition file to
    - import or create your step definitions
    -
3.  install & configure VSCode Cucumber plugin (optional)

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
  { // configuration for feature files
    extends: './vite.config.ts',
    test: {
      include : [ 'tests/*.feature' ],
      setupFiles: [ 'tests/tests.steps.ts' ],
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

## Differences from CucumberJS

The main library for Gherkin in the JS ecosystem is [CucumberJS],
a test runner written explicitly for Gherkin tests. QuickPickle aims to be
a complete replacement for that library, using Vite to handle bundling
and test running while maintaining functional parity with the original.
Nonetheless, there are differences. Here are the important ones that have
come to notice:

- **Each step definition MUST have the "world" variable as its first parameter:**

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

  "this" led to some sub-optimal usage, including:
  - Arrow functions couldn't be used, because "this" doesn't work with them.
  - When using a custom world, you would have to add `(this:CustomWorldType, ...params)`
    in typescript files or else you wouldn't get the right types.

- **The default "world" variable contains different information about the current step.**

  In CucumberJS, the default "world" variable contains information about the
  test *suite*, but not the *current step*. It's the opposite in QuickPickle;
  the "world" variable passed to each test step contains an "info" property
  with data about the current feature, rule, scenario or example, step, and line:

  ```gherkin
  Feature: Basic Test

    Rule: Every step must have access to information about itself
      This is so we can know what is happening when writing step definitions

      @tag-test
      Example: The world has info
        Given I run the tests
        Then the property "info.feature" should include "Basic Test"
        And the property "info.rule" should include "Every step must have access to information about itself"
        And the property "info.scenario" should include "The world has info"
        And the property "info.tags" should include "@tag-test"
        And the property "info.step" should include "FWAH!!! (or really whatever you write here, since it's part of the step)"
        And the property "info.line" should include "23"
  ```

- **Some tags have special meanings by default**

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

## Acknowledgements

This project started out as a fork of [vitest-cucumber-plugin] by Sam Ziegler.
It's been almost completely rewritten in the following ways:

- it has been converted to typescript
- a custom Gherkin parser has been replaced with the official [Gherkin Parser]
- the step definition format has been reverted to more closely match CucumberJS

Nonetheless, the brilliant ideas behind the original plugin are still present
in the architecture of this project. Thanks Sam, your work blew my mind.

!["it's so simple!" - Owen Wilson from Zoolander peers over an early 2000s iMac computer, a mad glint in his eye.](https://www.memecreator.org/static/images/memes/5439760.jpg)




[Vitest]: https://vitest.dev/
[Gherkin Syntax]: https://cucumber.io/docs/gherkin/reference/
[Gherkin Parser]: https://www.npmjs.com/package/@cucumber/gherkin
[CucumberJS]: https://github.com/cucumber/cucumber-js
[vitest-cucumber-plugin]: https://github.com/samuel-ziegler/vitest-cucumber-plugin
[PlaywrightWorld.ts]: https://github.com/dnotes/quickpickle/blob/main/packages/playwright/src/PlaywrightWorld.ts
[@quickpickle/playwright]: https://github.com/dnotes/quickpickle/tree/main/packages/playwright