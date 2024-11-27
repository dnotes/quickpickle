---
"quickpickle": minor
---

Added support for [custom parameter types], exactly as in CucumberJS.
A simple example:

```ts
// Step definition file
defineParameterType({
  name: 'updown',
  regexp: /(up|down)/,
})
Given('a number {int}', (world,num) => {
  world.number = num
})
When('the number goes {updown} {int}', (world, updown, num) => {
  if (updown === 'up') world.number += num
  else world.number -= num
})
Then('the number should be {int}', (world, num) => {
  expect(world.number).toBe(num)
})
```

```gherkin
Feature: Custom parameter types
  Scenario: The number
    Given a number 4
    When the number goes up 5
    Then the number should be 9
```

[custom parameter types]: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/api_reference.md#defineparametertypename-preferforregexpmatch-regexp-transformer-useforsnippets