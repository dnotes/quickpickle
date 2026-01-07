---
"@quickpickle/playwright": minor
"quickpickle": minor
---

Add a "priority" for step definitions, settable when the steps are added with `Given`, `When`, or `Then`. This is a non-breaking change for the QuickPickle API, allowing some step definitions to overlap and override others. An example from the playwright library follows: These two step definitions would overlap for the step `the "description" metatag should contain "this text"`, so the second step definition is added with a higher priority.

```ts
// File: packages/playwright/src/outcomes.steps.ts
Then('a/an/the (value of )(the ){string} {word} should contain/include/be/equal {string}', (fn), -10)
Then('the {string} meta( )tag should contain/include/be/equal {string}', (fn), -9)
```

If two matching step definitions have the same priority, an error is thrown.

All step definitions provided by QuickPickle modules should have a priority below 0 (the default priority), so that custom step definitions should override any standard step definitions by default.