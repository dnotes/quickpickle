---
"quickpickle": minor
---

feat: several additions to QuickPickleWorldInterface, fix explodeTags, refactor

feat: add QuickPickleWorld.toString() function that renders to a single descriptive line
feat: add QuickPickleWorld.info.stepIdx, to get the line number of the step within the scenario
feat: add QuickPickleWorld.info.explodedIdx, to get the index number for exploded tags
chore: renamed "qp" function to "gherkinStep", for better readability in traces
fix: fixed the explodeTags functionality when rendering
test: added tons of tests for the explodeTags functionality
