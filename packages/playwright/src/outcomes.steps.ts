import { Then } from "quickpickle";
import type { PlaywrightWorld } from "./PlaywrightWorld";
import { expect, Locator, Page } from '@playwright/test'
import './snapshotMatcher'
// ================
// Text on page

Then('I should see {string}( on the page)', async function (world:PlaywrightWorld, text) {
  await world.expectText(world.page, text)
})
Then('I should not/NOT see {string}( on the page)', async function (world:PlaywrightWorld, text) {
  await world.expectText(world.page, text, false)
})
Then('the text {string} should be visible( on the page)', async function (world:PlaywrightWorld, text) {
  await world.expectText(world.page, text)
})
Then('the text {string} should not/NOT be visible( on the page)', async function (world:PlaywrightWorld, text) {
  await world.expectText(world.page, text, false)
})

// ================
// Elements on page
Then('I should see a/an/the {string} {word}', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await world.expectElement(locator)
})
Then('I should not/NOT see a/an/the {string} {word}', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await world.expectElement(locator, false)
})
Then('I should see a/an/the {string} (element )with (the )(text ){string}', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await world.getLocator(world.page, identifier, 'element', text)
  await world.expectElement(locator)
})
Then('I should not/NOT see a/an/the {string} (element )with (the )(text ){string}', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await world.getLocator(world.page, identifier, 'element', text)
  await world.expectElement(locator, false)
})

// ================
// Element state
Then('a/an/the {string} {word} should be visible/hidden/invisible', async function (world:PlaywrightWorld, identifier, role) {
  let state = world.info.step?.match(/(\w+)$/)![0]
  let locator = world.getLocator(world.page, identifier, role)
  await world.expectElement(locator, true, state === 'visible')
})
Then('a/an/the {string} (element )with (the )(text ){string} should be visible/hidden/invisible', async function (world:PlaywrightWorld, identifier, text) {
  let state = world.info.step?.match(/(\w+)$/)![0]
  let locator = world.getLocator(world.page, identifier, 'element', text)
  await world.expectElement(locator, true, state === 'visible')
})
Then('a/an/the {string} {word} should be attached/detatched', async function (world:PlaywrightWorld, identifier, role) {
  let state = world.info.step?.match(/(\w)$/)![0] as 'attached'|'detached'
  let locator = world.getLocator(world.page, identifier, role)
  await locator.waitFor({ state, timeout:world.worldConfig.stepTimeout })
})
Then('a/an/the {string} (element )with (the )(text ){string} should be attached/detatched', async function (world:PlaywrightWorld, identifier, text) {
  let state = world.info.step?.match(/(\w)$/)![0] as 'attached'|'detached'
  let locator = world.getLocator(world.page, identifier, 'element', text)
  await locator.waitFor({ state, timeout:world.worldConfig.stepTimeout })
})

// disabled / enabled
Then('a/an/the {string} {word} should be disabled', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await expect(locator).toBeDisabled()
})
Then('a/an/the {string} {word} should be enabled', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await expect(locator).toBeEnabled()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be disabled', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await world.getLocator(world.page, identifier, 'element', text)
  await expect(locator).toBeDisabled()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be enabled', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await world.getLocator(world.page, identifier, 'element', text)
  await expect(locator).toBeEnabled()
})

// checked / unchecked
Then('a/an/the {string} {word} should be checked', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await expect(locator).toBeChecked()
})
Then('a/an/the {string} {word} should be unchecked', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await expect(locator).not.toBeChecked()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be checked', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await world.getLocator(world.page, identifier, 'element', text)
  await expect(locator).toBeChecked()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be unchecked', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await world.getLocator(world.page, identifier, 'element', text)
  await expect(locator).not.toBeChecked()
})

// focused / unfocused
Then('a/an/the {string} {word} should be focused/active', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await expect(locator).toBeFocused()
})
Then('a/an/the {string} {word} should be unfocused/blurred', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await expect(locator).not.toBeFocused()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be focused/active', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await world.getLocator(world.page, identifier, 'element', text)
  await expect(locator).toBeFocused()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be unfocused/blurred', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await world.getLocator(world.page, identifier, 'element', text)
  await expect(locator).not.toBeFocused()
})

// in viewport / out of viewport
Then('a/an/the {string} {word} should be in(side) (of )the viewport', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await expect(locator).toBeInViewport()
})
Then('a/an/the {string} {word} should be out(side) (of )the viewport', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await expect(locator).not.toBeInViewport()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be in(side) (of )the viewport', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await world.getLocator(world.page, identifier, 'element', text)
  await expect(locator).toBeInViewport()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be out(side) (of )the viewport', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await world.getLocator(world.page, identifier, 'element', text)
  await expect(locator).not.toBeInViewport()
})


// Values
Then('a/an/the (value of ){string} should contain/include/be/equal {string}', async function (world:PlaywrightWorld, identifier, expected) {
  let exact = world.info.step?.match(/ should (?:be|equal) ['"]/) ? true : false
  let locator = await world.getLocator(world.page, identifier, 'input')
  if (exact) await expect(locator).toHaveValue(expected)
  else {
    let actual = await locator.inputValue()
    await expect(actual).toContain(expected)
  }
})
Then('a/an/the (value of )(the ){string} {word} should contain/include/be/equal {string}', async function (world:PlaywrightWorld, identifier, role, expected) {
  let exact = world.info.step?.match(/ should (?:be|equal) ['"]/) ? true : false
  if (role === 'metatag') await world.expectMetatag(world.page, identifier, expected, exact)
  else {
    let locator = await world.getLocator(world.page, identifier, role)
    if (exact) await expect(locator).toHaveValue(expected)
    else {
      let actual = await locator.inputValue()
      await expect(actual).toContain(expected)
    }
  }
})

Then('a/an/the (value of )(the ){string} should not/NOT contain/include/be/equal {string}', async function (world:PlaywrightWorld, identifier, expected) {
  let exact = world.info.step?.match(/ should (?:not|NOT) (?:be|equal) ['"]/) ? true : false
  let locator = await world.getLocator(world.page, identifier, 'input')
  if (exact) await expect(locator).not.toHaveValue(expected)
  else {
    let actual = await locator.inputValue()
    await expect(actual).not.toContain(expected)
  }
})
Then('a/an/the (value of )(the ){string} {word} should not/NOT contain/include/be/equal {string}', async function (world:PlaywrightWorld, identifier, role, expected) {
  let exact = world.info.step?.match(/ should (?:not|NOT) (?:be|equal) ['"]/) ? true : false
  if (role === 'metatag') await world.expectMetatag(world.page, identifier, expected, exact, false)
  else {
    let locator = await world.getLocator(world.page, identifier, role)
    if (exact) await expect(locator).not.toHaveValue(expected)
    else {
      let actual = await locator.inputValue()
      await expect(actual).not.toContain(expected)
    }
  }
})

// Metatags
Then('the meta( )tag {string} should contain/include/be/equal {string}', async function (world:PlaywrightWorld, name, expected) {
  let exact = world.info.step?.match(/ should (?:be|equal) ['"]/) ? true : false
  await world.expectMetatag(world.page, name, expected, exact)
})
Then('the meta( )tag {string} should not/NOT contain/include/be/equal {string}', async function (world:PlaywrightWorld, name, expected) {
  let exact = world.info.step?.match(/ should (?:not|NOT) (?:be|equal) ['"]/) ? true : false
  await world.expectMetatag(world.page, name, expected, exact, false)
})

// Visual regression testing
Then('(the )screenshot should match', async function (world:PlaywrightWorld) {
  await expect(world.page).toMatchScreenshot(world.screenshotPath)
})
Then('(the )screenshot {string} should match', async function (world:PlaywrightWorld, name:string) {
  let explodedTags = world.info.explodedIdx ? `_(${world.info.tags.join(',')})` : ''
  await expect(world.page).toMatchScreenshot(`${world.worldConfig.screenshotDir}/${name}${explodedTags}.png`)
})
Then('(the )screenshot of the {string} {word} should match', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await expect(locator).toMatchScreenshot(world.screenshotPath)
})
Then('(the )screenshot {string} of the {string} {word} should match', async function (world:PlaywrightWorld, name, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  let explodedTags = world.info.explodedIdx ? `_(${world.info.tags.join(',')})` : ''
  await expect(locator).toMatchScreenshot(`${world.worldConfig.screenshotDir}/${name}${explodedTags}.png`)
})

// Browser context
Then('the user agent should contain/be {string}', async function (world:PlaywrightWorld, ua) {
  let exact = world.info.step?.match(/ should (?:be|equal) ['"]/) ? true : false
  if (exact) await expect(world.browser.browserType().name()).toBe(ua)
  else await expect(world.browser.browserType().name()).toContain(ua)
})
Then('the url should contain/include/be/equal {string}', async function (world:PlaywrightWorld, url) {
  let exact = world.info.step?.match(/ should (?:be|equal) ['"]/) ? true : false
  if (exact) await expect(world.page.url()).toBe(url)
  else await expect(world.page.url()).toContain(url)
})
