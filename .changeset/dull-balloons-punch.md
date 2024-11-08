---
"quickpickle": patch
---

Fixed problems with Scenario Outline rendering; under the following conditions,
and probably some others, the renderer would fail.

- If a parameter were named "context"
- Any regex characters (e.g. *) in a parameter name
- Having a ton of examples
- If a parameter name started with a number