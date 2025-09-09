---
"@quickpickle/playwright": minor
"quickpickle": minor
---

Added an "AriaRole" parameter type, matching all Aria roles
as well as the quickpickle-specific extensions "input" and "element"

@quickpickle/playwright now uses this matcher instead of {word} for
matching visual elements on the page.
