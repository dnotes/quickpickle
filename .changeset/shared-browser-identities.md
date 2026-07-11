---
"@quickpickle/playwright": minor
---

Add shared-browser support for identities: 
one identity can use another identity's browser.

Added the following API:

- `world.setUsingBrowser(targetBrowser, name?)` sets identity {name} to use identity {targetBrowser}'s browser
- `world.clearUsingBrowser(name?)` clears usingBrowser for identity {name}
- `world.usingBrowserFor(name)` returns the identity of the browser actually being used
- `world.pageFor(name)` returns a page
- `world.browserFor(name)` returns a browser context
