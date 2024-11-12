---
"quickpickle": patch
---

Fix tagged hooks to match [@cucumber/cucumber implementation].
Tagged hooks are hooks that only run in the context of certain tags;
for example, a BeforeAll hook that only starts the server for
Features tagged with "@server".

This change also adds info about the Feature to the "common" variable.

[@cucumber/cucumber implementation]:
https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/hooks.md
