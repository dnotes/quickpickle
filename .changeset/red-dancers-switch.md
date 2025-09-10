---
"@quickpickle/playwright": major
---

## 1.0 release

From this point forward, the step definitions in "actions" and "outcomes"
should be stable, and any changes to the step names will result in a new
minor version release.

I was hoping to have some system for using only *some* of the step definitions
provided by the module, or for overriding or deleting them, but I think that
will have to wait for the next major release.

### Identities

The last thing added for this release is the functionality for multiple browsers
or "identities". Switching identity starts a new browser context, with completely
new local data, making it possible to test interactions between different users.

Each test will start with a "default" identity, and new browser contexts open
on the same url as the "default" identity.

Note that no actual *user* is created as a result of switching identity; if you
need more setup, you can create a custom world constructor extending the
PlaywrightWorld class and override the "setIdentity" method.

The following new step definitions all simply call "world.setIdentity()", which
creates a new browser context if necessary and switches to it:

- `(as )a/an/the (user ){string}`
- `(as )a/an/the {string} user/role/browser/identity`
- `I am {string}`
- `I am a/an/the (user ){string}`
- `I am a/an/the {string} user/role/browser/identity`
- `as {string}`

### New step definitions

`I am on the home/front page` opens the base url.
