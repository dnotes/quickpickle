import { Then } from "quickpickle";
import type { PlaywrightWorld } from "./PlaywrightWorld";
import { expect, Locator, Page } from '@playwright/test'
import './snapshotMatcher'
import { getLocator } from "./helpers";

// ================
// Text on page
async function assertVisibleText(page:Page, text:string, visible:boolean=true) {
  try {
    if (visible) await expect(await page.getByText(text).locator(`visible=true`).count()).toBeGreaterThan(0)
    else await expect(await page.getByText(text).locator(`visible=true`).count()).toBe(0)
  }
  catch(e) {
    throw new Error(`The text "${text}" was unexpectedly ${visible ? 'not found' : 'found'} on the page.`)
  }
}
Then('I should see {string}( on the page)', async function (world:PlaywrightWorld, text) {
  await assertVisibleText(world.page, text)
})
Then('I should not/NOT see {string}( on the page)', async function (world:PlaywrightWorld, text) {
  await assertVisibleText(world.page, text, false)
})
Then('the text {string} should be visible( on the page)', async function (world:PlaywrightWorld, text) {
  await assertVisibleText(world.page, text)
})
Then('the text {string} should not/NOT be visible( on the page)', async function (world:PlaywrightWorld, text) {
  await assertVisibleText(world.page, text, false)
})

// ================
// Elements on page
async function assertVisibleElement(locator:Locator, visible:boolean=true) {
  try {
    if (visible) await expect(await locator.locator('visible=true').count()).toBeGreaterThan(0)
    else await expect(await locator.locator('visible=true').count()).toBe(0)
  }
  catch(e) {
    throw new Error(`The element "${locator}" was unexpectedly ${visible ? 'not visible' : 'visible'} on the page.`)
  }
}
Then('I should see a/an/the {string} {word}', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await assertVisibleElement(locator)
})
Then('I should not/NOT see a/an/the {string} {word}', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await assertVisibleElement(locator, false)
})
Then('I should see a/an/the {string} (element )with (the )(text ){string}', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await getLocator(world.page, identifier, 'element', text)
  await assertVisibleElement(locator)
})
Then('I should not/NOT see a/an/the {string} (element )with (the )(text ){string}', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await getLocator(world.page, identifier, 'element', text)
  await assertVisibleElement(locator, false)
})

// ================
// Element state

// visible / hidden
async function assertInvisibleElement(locator:Locator, identifier:string) {
  if (await locator.count() === 0) throw new Error(`The element "${identifier}" was unexpectedly not found on the page.`)
  try {
    await expect(locator).not.toBeVisible()
  }
  catch(e) {
    throw new Error(`The element "${identifier}" was unexpectedly visible on the page.`)
  }
}
Then('a/an/the {string} should be visible', async function (world:PlaywrightWorld, identifier) {
  let locator = await getLocator(world.page, identifier, 'element')
  await expect(locator).toBeVisible()
})
Then('a/an/the {string} should be hidden/invisible', async function (world:PlaywrightWorld, identifier) {
  let locator = await getLocator(world.page, identifier, 'element')
  await assertInvisibleElement(locator, identifier)
})
Then('a/an/the {string} {word} should be visible', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await expect(locator).toBeVisible()
})
Then('a/an/the {string} {word} should be hidden/invisible', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await assertInvisibleElement(locator, identifier)
})
Then('a/an/the {string} (element )with (the )(text ){string} should be visible', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await getLocator(world.page, identifier, 'element', text)
  await expect(locator).toBeVisible()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be hidden/invisible', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await getLocator(world.page, identifier, 'element', text)
  await assertInvisibleElement(locator, identifier)
})

// disabled / enabled
Then('a/an/the {string} should be disabled', async function (world:PlaywrightWorld, identifier) {
  let locator = await getLocator(world.page, identifier, 'element')
  await expect(locator).toBeDisabled()
})
Then('a/an/the {string} should be enabled', async function (world:PlaywrightWorld, identifier) {
  let locator = await getLocator(world.page, identifier, 'element')
  await expect(locator).toBeEnabled()
})
Then('a/an/the {string} {word} should be disabled', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await expect(locator).toBeDisabled()
})
Then('a/an/the {string} {word} should be enabled', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await expect(locator).toBeEnabled()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be disabled', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await getLocator(world.page, identifier, 'element', text)
  await expect(locator).toBeDisabled()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be enabled', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await getLocator(world.page, identifier, 'element', text)
  await expect(locator).toBeEnabled()
})

// checked / unchecked
Then('a/an/the {string} should be checked', async function (world:PlaywrightWorld, identifier) {
  let locator = await getLocator(world.page, identifier, 'element')
  await expect(locator).toBeChecked()
})
Then('a/an/the {string} should be unchecked', async function (world:PlaywrightWorld, identifier) {
  let locator = await getLocator(world.page, identifier, 'element')
  await expect(locator).not.toBeChecked()
})
Then('a/an/the {string} {word} should be checked', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await expect(locator).toBeChecked()
})
Then('a/an/the {string} {word} should be unchecked', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await expect(locator).not.toBeChecked()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be checked', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await getLocator(world.page, identifier, 'element', text)
  await expect(locator).toBeChecked()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be unchecked', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await getLocator(world.page, identifier, 'element', text)
  await expect(locator).not.toBeChecked()
})

// focused / unfocused
Then('a/an/the {string} should be focused/active', async function (world:PlaywrightWorld, identifier) {
  let locator = await getLocator(world.page, identifier, 'element')
  await expect(locator).toBeFocused()
})
Then('a/an/the {string} should be unfocused/blurred', async function (world:PlaywrightWorld, identifier) {
  let locator = await getLocator(world.page, identifier, 'element')
  await expect(locator).not.toBeFocused()
})
Then('a/an/the {string} {word} should be focused/active', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await expect(locator).toBeFocused()
})
Then('a/an/the {string} {word} should be unfocused/blurred', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await expect(locator).not.toBeFocused()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be focused', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await getLocator(world.page, identifier, 'element', text)
  await expect(locator).toBeFocused()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be unfocused/blurred', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await getLocator(world.page, identifier, 'element', text)
  await expect(locator).not.toBeFocused()
})

// Forms
Then('a/an/the value in/of/for (the ){string} {word} should contain/include/be/equal {string}', async function (world:PlaywrightWorld, identifier, role, expected) {
  let exact = world.info.step?.match(/ should (?:be|equal) ['"]/) ? true : false
  let locator = await getLocator(world.page, identifier, role)
  if (exact) await expect(locator).toHaveValue(expected)
  else {
    let actual = await locator.inputValue()
    await expect(actual).toContain(expected)
  }
})
Then('a/an/the value in/of/for (the ){string} {word} should not/NOT contain/include/be/equal {string}', async function (world:PlaywrightWorld, identifier, role, expected) {
  let exact = world.info.step?.match(/ should (?:not|NOT) (?:be|equal) ['"]/) ? true : false
  let locator = await getLocator(world.page, identifier, role)
  if (exact) await expect(locator).not.toHaveValue(expected)
  else {
    let actual = await locator.inputValue()
    await expect(actual).not.toContain(expected)
  }
})


// Metatags
Then('the {string} metatag should contain/include/be/equal {string}', async function (world:PlaywrightWorld, name, expected) {
  let exact = world.info.step?.match(/ should (?:be|equal) ['"]/) ? true : false

  let actual:string|null

  if (name === 'title') actual = await world.page.title()
  else actual = await (await world.page.locator(`meta[name="${name}"]`)).getAttribute('content')

  if (expected === "") await expect(actual).toBeNull()
  else if (exact) await expect(expected).toBe(actual)
  else await expect(actual).toContain(expected)
})
Then('the {string} metatag should not/NOT contain/include/be/equal {string}', async function (world:PlaywrightWorld, name, expected) {
  let exact = world.info.step?.match(/ should (?:not|NOT) (?:be|equal) ['"]/) ? true : false

  let actual:string|null

  if (name === 'title') actual = await world.page.title()
  else actual = await (await world.page.locator(`meta[name="${name}"]`)).getAttribute('content')

  if (expected === "") await expect(actual).not.toBeNull()
  else if (exact) await expect(expected).not.toBe(actual)
  else await expect(actual).not.toContain(expected)
})

// Visual regression testing
Then('(the )screenshot should match', async function (world:PlaywrightWorld) {
  await expect(world.page).toMatchScreenshot(`${world.playwrightConfig.screenshotDir}/${world.info.rule ? world.info.rule + '__' + world.info.scenario : world.info.scenario}__${world.info.line}.png`)
})
Then('(the )screenshot {string} should match', async function (world:PlaywrightWorld, name:string) {
  await expect(world.page).toMatchScreenshot(`${world.playwrightConfig.screenshotDir}/${name}.png`)
})

// Browser context
Then('the user agent should contain/be {string}', async function (world:PlaywrightWorld, ua) {
  await expect(world.browser.browserType().name()).toContain(ua)
})
Then('the url should contain {string}', async function (world:PlaywrightWorld, url) {
  await expect(world.page.url()).toContain(url)
})