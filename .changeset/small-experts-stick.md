---
"@quickpickle/playwright": minor
"quickpickle": minor
---

This release adds new interfaces and world constructor class for a "VisualWorld"
to QuickPickle main library. All visual testing libraries (Playwright, Vitest Browser)
should implement the VisualWorldInterface, and may extend the VisualWorld class,
which encapsulates helpful functionality for screenshots.
