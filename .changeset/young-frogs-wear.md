---
"quickpickle": minor
---

Fix: Vitest test extensions (skip,todo,etc.) work with QuickPickle explodeTags config. Before this, any tags in the `skipTags` config would skip all of the descendant scenarios, regardless of whether they were eventually exploded out of the tags array for the individual scenario.
