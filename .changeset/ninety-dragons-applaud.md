---
"@quickpickle/playwright": patch
---

feat(playwright): file loading, snapshots, and browsers (oh my!)

feat: added basic visual regression testing
feat: added choice of browser: chromium, firefox, webkit
feat: added options: - host: the base url host - port: the base url port - screenshotDir: the directory for sceenshots - nojsTags: tags to start the browser without js - showBrowserTags: tags to show a browser for that test - slowMoTags: tags to run that test with slowMo enabled - slowMoMs: number of milliseconds to run slowMo
feat: added world.baseUrl getter
fix: remove timeouts for all step defintions (use slowmo instead)
fix: fixed expression for outcome step "I should see {string} element with {string}"
feat: added outcome step "the user agent should contain/be {string}"
feat: added outcome step "the screenshot should match"
feat: added outcome step "the screenshot {string} should match"
fix: make the action steps for navigation respect the config
feat: added action step "I load the file {string}"
fix: fixed the screenshot steps

test: added test html files for faster loading
test: removed old tests dependent on internet
test: tests for concurrent testing in different browsers
test: tests for showing brorwser and slowmo
test: tests for visual regression testing
