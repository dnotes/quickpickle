---
"@quickpickle/playwright": minor
"quickpickle": minor
---

Added a "weight" property to Hooks for ordering.

@quickpickle/playwright uses the new weight property to ensure that
its After hook gets run last (weight:99), so that there will still
be a browser in other After hooks. The upshot of this is that now
you can write hooks like the following, which takes a screenshot
after any Scenario with the proper tag:

```ts
After('@screenshot', async (world:PlaywrightWorld) => {
  await world.screenshot()
})
```