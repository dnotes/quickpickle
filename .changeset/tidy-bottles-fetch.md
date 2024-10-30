---
"@quickpickle/playwright": minor
"quickpickle": minor
---

## Configuration of the world variable

QuickPickle now handles setting up the WorldConfig for any world builder
that extends the QuickPickleWorld class. That worldConfig is now accessable
in world.info.config.worldConfig, and in the read-only getter world.worldConfig.

The @quickpickle/playwright plugin has been updated to use the new API.

Any world builder classes using the old API will continue to function as before
for the time being.

## New API available for "soft" failure

Occasionally you may want to allow a scenario to continue running even after
a step has failed. Some use cases might be:

- to check the nature of the error thrown in a previous step
- to see all the errors from a longer list of steps
- to take a screenshot if there are any errors

There is now an API for this purpose: Scenarios can be tagged for "soft" failure.
The default tags are "@soft" or "@softfail", which can be configured at "softFailTags".
Scenarios tagged for soft failure will continue to run until the end of the Scenario,
and the Before and After hooks will be run as well. Any errors will be collected in
world.info.errors. If there are errors after the last step and After hooks have run,
then the Scenario will fail.

Note that this is analogous but slightly different from soft assertions in other
test frameworks like Vitest and Playwright, in that if you don't clear out the
accumulated errors, the Scenario will still fail at the end.
