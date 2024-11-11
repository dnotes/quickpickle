---
"@quickpickle/playwright": patch
"quickpickle": patch
---

Added common variable should to BeforeAll and AfterAll hooks.
In your support files, you can get or set variables that should be
common (shared) across all the tests in the Feature file.

In general it is not good testing practice to use this for anything
other than setup and teardown; for example, you might start a server
and save the port in BeforeAll, then tear it down in AfterAll.

Here is a ridiculous example demonstrating the functionality:

```ts
import { BeforeAll, AfterAll, AfterStep } from 'quickpickle'
BeforeAll(async (common) => { common.totalSteps = 0 })
AfterStep(async (world) => { world.common.totalSteps++ })
AfterAll(async(common) => { expect(common.totalSteps).not.toBeFalsy() })
```
