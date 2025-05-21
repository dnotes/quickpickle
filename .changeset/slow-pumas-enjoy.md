---
"@quickpickle/vitest-browser": minor
---

Major refactor with breaking changes, including to the World Constructor APIs.

* Added tests for all step definitions (using Svelte) based on Playwright package tests
* Added basic instructions to README
* Added scrolling step definitions
* Added screenshot step definitions
* Added step definitions to test for integer values
* Added step definitions to check that an element is in the viewport
* Added step definitions to check for clicked items
* Changed the VitestBrowserWorld API to accommodate step definitions
* Changed the React, Vue and Svelte worlds to use the new API

BREAKING CHANGES:

* When extending the VitestBrowserWorld class, subclasses must implement the `render`
  and `cleanup` methods. The `render` method must not only render the component
  but also set the `page` property using RenderResult.container.