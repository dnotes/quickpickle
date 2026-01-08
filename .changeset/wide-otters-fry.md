---
"@quickpickle/playwright": minor
---

Change default settings for PlaywrightWorld. The following default settings have been changed:

- slowMoMs: `100` - long enough as a default when slowMo is enabled (which shouldn't be necessary anyhow)
- defaultBrowserSize: `mobile` - this was `desktop` before, which resulted in larger images and less mobile testing
- defaultTimeout: `1000` - this is a new setting for the timeout for actions (waiting for locators, etc.)
- navigationTimeout: `3000` - this is a new setting for the timeout for navigations

NOTE: If you use visual regression testing and haven't specifically set browser sizes, this will break those baselines.