# QuickPickle

QuickPickle is a plugin for [Vitest] to run tests written in [Gherkin Syntax].
It seamlessly integrates Gherkin Feature files into your Vitest testing workflow
by parsing them with the official [Gherkin Parser] and running them as Vitest tests.

## Features

- Seamless integration of Gherkin Feature files into Vitest testing workflow
- Parses Gherkin Feature files using the official [Gherkin Parser]
- Full typescript and javascript support (because it's really just Vitest)
- Full support for Gherkin 6 Syntax

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

- For unit tests, it's usually better to use plain Vitest or another testing framework.

## Installation

```sh
npm install --save-dev quickpickle vitest
```

## Configuration

Add the quickpickle plugin to your Vitest configuration in vite.config.ts (or .js, etc.):

```ts
// vite.config.ts
import { quickpickle } from 'quickpickle';

const qpConfig:Partial<QuickPickleConfig> = { // <-- Optional configuration (defaults shown)

  /**
   * The files to be imported for each Feature.
   * All step definitions, hooks, world constructor, etc. must be listed.
   * The value can be a glob pattern or an array of glob patterns.
   */
  import: [
    '{features,test,tests}/**/*.steps.{ts,js,mjs}',
    '{features,test,tests}/**/*.world.{ts,js,mjs}'
  ]

}

export default {
  plugins: [
    quickpickle(qpConfig) // <-- Add the quickpickle plugin
  ],
  test: {
    include : [
      'features/*.feature', // <-- Add Gherkin feature files into "test" configuration
      // (you'll probably want other test files too, for unit tests etc.)
    ],
  },
};
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
in the "import" declaration of the qpConfig object above.

These files will be imported into the Vitest test runner, and the code for
`Given`, `When`, `Then` will register each of the step definitions with quickpickle.
These step definitions should run on import, i.e. at the top level of the script,
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

### Define a custom "world" variable

...instructions coming soon! :)

## Differences from CucumberJS

The main library for Gherkin in the JS ecosystem is [CucumberJS],
a test runner written explicitly for Gherkin tests. QuickPickle aims to be
a complete replacement for that library, using Vite to handle bundling
and test running while maintaining functional parity with the original.
Nonetheless, there are differences. Here are the important ones that have
come to notice:

- Each step definition MUST have the "world" variable as its first parameter:

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

- The default "world" variable contains information about the current step.

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