---
"quickpickle": patch
---

fix: some errors would error when formatting stack

In some environments, errors during step execution are
not formatted correctly, leading to another error that
is very unhelpful. This commit works around that problem.