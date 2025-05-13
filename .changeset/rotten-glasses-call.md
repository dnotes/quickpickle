---
"quickpickle": patch
---

fix: removed dependency on @cucumber/cucumber for DataTable

The DataTable model from @cucumber/cucumber is now mirrored by
QuickPickle because including it from the cucumber-js package
brought all the test runner stuff with it, which was too big
and messed up anything that tried to run in the browser.
