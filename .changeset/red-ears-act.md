---
"@quickpickle/playwright": minor
"@quickpickle/vitest-browser": minor
"quickpickle": minor
---

Add a true path sanitizer to the base World object

BREAKING CHANGE:

The base world object no longer has a public `projectRoot` property.
Instead of constructing paths that way, developers should use the
`world.fullPath()` method to get the full path to a file or subfolder.
This should ensure that only files below the projectRoot are accessed.

Playwright and Browser world constructors no longer have the
sanitizeFilepath method. Instead, there is a new "sanitizePath"
method on the base World, which should be relatively safe even
for user input, avoiding path traversal and the like.