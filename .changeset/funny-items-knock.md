---
"quickpickle": minor
"@quickpickle/playwright": patch
---

- changed tagsMatch API for QuickPickleWorldInterface -- it now returns string[] or null,
  which makes it easier for other plugins to get matching tags from a list.

- added browser sizes to PlaywrightWorld; they can be chosen with tags or set via a Gherkin step.
