# @quickpickle/vitest-browser

## 0.2.1

### Patch Changes

- Updated dependencies [f14aafc]
- Updated dependencies [596516b]
- Updated dependencies [1619ff4]
- Updated dependencies [cead779]
  - quickpickle@1.10.0

## 0.2.0

### Minor Changes

- 8273918: Switched to VisualWorld class for visual regression testing

### Patch Changes

- Updated dependencies [e617638]
  - quickpickle@1.9.0

## 0.1.0

### Minor Changes

- 8a32a09: Add a true path sanitizer to the base World object

  BREAKING CHANGE:

  The base world object no longer has a public `projectRoot` property.
  Instead of constructing paths that way, developers should use the
  `world.fullPath()` method to get the full path to a file or subfolder.
  This should ensure that only files below the projectRoot are accessed.

  Playwright and Browser world constructors no longer have the
  sanitizeFilepath method. Instead, there is a new "sanitizePath"
  method on the base World, which should be relatively safe even
  for user input, avoiding path traversal and the like.

- 15e0e06: Major refactor with breaking changes, including to the World Constructor APIs.

  - Added tests for all step definitions (using Svelte) based on Playwright package tests
  - Added basic instructions to README
  - Added scrolling step definitions
  - Added screenshot step definitions
  - Added step definitions to test for integer values
  - Added step definitions to check that an element is in the viewport
  - Added step definitions to check for clicked items
  - Changed the VitestBrowserWorld API to accommodate step definitions
  - Changed the React, Vue and Svelte worlds to use the new API

  BREAKING CHANGES:

  - When extending the VitestBrowserWorld class, subclasses must implement the `render`
    and `cleanup` methods. The `render` method must not only render the component
    but also set the `page` property using RenderResult.container.

### Patch Changes

- Updated dependencies [8a32a09]
  - quickpickle@1.8.0

## 0.0.3

### Patch Changes

- 186848c: fix types and frameworks imports, and remove old file
- Updated dependencies [9145a9c]
  - quickpickle@1.7.1

## 0.0.2

### Patch Changes

- 02bcadf: added react and vue for the browser module
- b1217d0: Initial functionality is working.
- Updated dependencies [2e7530d]
- Updated dependencies [094f7dd]
- Updated dependencies [7ad035c]
- Updated dependencies [1cf8cca]
- Updated dependencies [ab52cf6]
- Updated dependencies [1162c84]
  - quickpickle@1.7.0
