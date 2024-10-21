# @quickpickle/playwright

@quickpickle/playwright is an extension for [QuickPickle] that integrates [Playwright]
for end-to-end testing of web applications in a full browser context.

## Features

* A custom world constructor with a configurable browser
* Pre-defined step definitions for common browser actions and assertions
* Support for easy visual regression testing
* Support for multiple browsers (Chromium, Firefox, WebKit)
* Configuration options for the browser and the test runner

## Installation

```bash
npm install --save-dev quickpickle @quickpickle/playwright
```

## Usage

### Setup quickpickle with Vitest

First set up vitest to recognize your features and setup files. This is the example
from the [quickpickle] documentation:

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

### Using the default PlaywrightWorld constructor

To use the default PlaywrightWorld constructor, import `@quickpickle/playwright/world`
in one of your setup files:

```ts
// tests/tests.steps.ts
import '@quickpickle/playwright/world'
```

### Using the provided step definitions

@quickpickle/playwright provides a wide range of step definitions for common actions and assertions
related to UI testing in a browser context. These step definitions are available in the following
files, which can also be imported in your setup files:

```ts
// tests/tests.steps.ts
import '@quickpickle/playwright/actions'
import '@quickpickle/playwright/outcomes'
```

Note that these step definitions are NOT STABLE, and this is the primary reason this package
has not achieved a full release. What we want is to define a set of step definitions that can
be used across all projects for UI testing, and we're probably not really close.

### Extending the PlaywrightWorld constructor

You can extend the PlaywrightWorld constructor to meet your own environmental requirements:

```ts
import { PlaywrightWorld, PlaywrightWorldConfig } from '@quickpickle/playwright';
import type { TestContext } from 'vitest';
import type { QuickPickleWorldInterface } from 'quickpickle';

export class CustomPlaywrightWorld extends PlaywrightWorld {
  customProperty: string;

  constructor(context: TestContext, info: QuickPickleWorldInterface['info'], worldConfig: Partial<PlaywrightWorldConfig> = {}) {
    super(context, info, worldConfig);
    this.customProperty = 'Custom value';
  }

  async init() {
    await super.init();
    // Add custom initialization logic here
    console.log('Custom world initialized');
  }

  customMethod() {
    console.log(`Custom method called with ${this.customProperty}`);
  }
}

// Don't forget to set the world constructor
import { setWorldConstructor } from 'quickpickle';
setWorldConstructor(CustomPlaywrightWorld);
```

### Configuring the PlaywrightWorld constructor

The PlaywrightWorld constructor can be configured by passing an object to the quickpickle
Vite plugin builder, or by passing a quickpickle configuration object to the "test" object.
Both of these are demonstrated in the file below, but only one is needed:

```ts
// vite.config.ts
import { quickpickle } from 'quickpickle';

export default {
  plugins: [
    quickpickle({ // <-- add the quickpickle plugin

      // General quickpickle configuration
      explodeTags: [
        ['nojs','js'],
        ['chromium','firefox','webkit'],
        ['mobile','tablet','desktop','widescreen'],
      ],

      // PlaywrightWorld configuration
      worldConfig: {
        port: 5173, // sets the port
        slowMo: 50, // turns on "slowMo" for 50ms
      }

    })
  ],
  test: {
    include : [
      'features/*.feature',
    ],
    setupFiles: ['./tests/tests.steps.ts'],
    quickpickle: {

      // General quickpickle configuration
      explodeTags: [
        ['nojs','js'],
        ['chromium','firefox','webkit'],
        ['mobile','tablet','desktop','widescreen'],
      ],

      // PlaywrightWorld configuration
      worldConfig: {
        port: 5173, // sets the port
        slowMo: 50, // turns on "slowMo" for 50ms
      }

    }
  },
```

The full list of options, with defaults, is here:

```ts
export type PlaywrightWorldConfigSetting = Partial<{
  host: string, // default host, including protocol (default: http://localhost)
  port: number, // port to which the browser should connect (default: undefined)
  screenshotDir: string, // directory in which to save screenshots (default: "screenshots")
  nojsTags: string|string[] // tags for scenarios to run without javascript (default: @nojs, @noscript)
  showBrowserTags: string|string[] // tags for scenarios to run with browser visible (default: @browser, @show-browser, @showbrowser)
  slowMoTags: string|string[] // tags for scenarios to be run with slow motion enabled (default: @slowmo)
  headless: boolean // whether to run the browser in headless mode (default true)
  slowMo: boolean|number // whether to run the browser with slow motion enabled (default false)
  slowMoMs: number // the number of milliseconds to slow down the browser by (default 500)
  keyboardDelay: number // the number of milliseconds between key presses (default:20)
  defaultBrowser: 'chromium'|'firefox'|'webkit' // the default browser to use (default: chromium)
  browserSizes: Record<string,string> // the default browser sizes to use, in the form "widthxheight"
  // (default: { mobile: "480x640", tablet: "1024x768", desktop: "1920x1080", widescreen: "3440x1440" })
  defaultBrowserSize: string // the default browser size to use (default: desktop)
}>
```

### Use @quickpickle/playwright in CI

In order to run playwright tests in CI, you'll need to set up the playwright browsers.
See [quickpickle's release.yml Github action] for example.


[quickpickle]: https://github.com/dnotes/quickpickle
[QuickPickle]: https://github.com/dnotes/quickpickle
[Playwright]: https://github.com/microsoft/playwright
[quickpickle's release.yml Github action]: https://github.com/dnotes/quickpickle/blob/main/.github/workflows/release.yml