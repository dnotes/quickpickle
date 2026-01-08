---
"@quickpickle/playwright": minor
"@quickpickle/vitest-browser": minor
---

Refactor timeout configuration to avoid confusion with QuickPickle's `stepTimeout` setting: the Playwright/Browser world config's property (previously also confusingly named `stepTimeout`) has been renamed to `defaultTimeout`, and new `actionTimeout` and `navigationTimeout` options have been added to allow separate configuration of action and navigation timeouts. Default timeouts are now automatically set on BrowserContext/Page when created, eliminating the need to pass timeout parameters to individual actions, and this should work for both the Playwright library and the Vitest Browser library, both of which use Playwright in the backend. The defaults are now 1000ms for actions and 3000ms for navigation.
