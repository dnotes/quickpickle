---
"quickpickle": minor
---

Added new VisualWorld base class and interface

* the VisualWorld class provides some basic functionality related to screenshots,
  so that any descendant classes will not have to do things like parse their own
  screenshot filenames or implement their own image diff solution.

* the VisualWorldInterface defines a set of helper methods to be implemented by
  descendant classes.