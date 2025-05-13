import { Then } from "quickpickle";
import type { VitestBrowserWorld } from "./VitestBrowserWorld";
import { expect } from 'vitest'

/// <reference types="@vitest/browser/providers/playwright" />

// ================
// Text on page

Then('I should see {string}( on the page)', async function (world:VitestBrowserWorld, text) {
  await world.expectText(world.page, text)
})
Then('I should not/NOT see {string}( on the page)', async function (world:VitestBrowserWorld, text) {
  await world.expectText(world.page, text, false)
})
Then('the text {string} should be visible( on the page)', async function (world:VitestBrowserWorld, text) {
  await world.expectText(world.page, text)
})
Then('the text {string} should not/NOT be visible( on the page)', async function (world:VitestBrowserWorld, text) {
  await world.expectText(world.page, text, false)
})

// ================
// Elements on page
Then('I should see a/an/the {string} {word}', async function (world:VitestBrowserWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await world.expectElement(locator)
})
Then('I should not/NOT see a/an/the {string} {word}', async function (world:VitestBrowserWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await world.expectElement(locator, false)
})
Then('I should see a/an/the {string} (element )with (the )(text ){string}', async function (world:VitestBrowserWorld, identifier, text) {
  let locator = await world.getLocator(world.page, identifier, 'element', text)
  await world.expectElement(locator)
})
Then('I should not/NOT see a/an/the {string} (element )with (the )(text ){string}', async function (world:VitestBrowserWorld, identifier, text) {
  let locator = await world.getLocator(world.page, identifier, 'element', text)
  await world.expectElement(locator, false)
})

// ================
// Element state
Then('a/an/the {string} {word} should be visible/hidden/invisible', async function (world:VitestBrowserWorld, identifier, role) {
  let state = world.info.step?.match(/(\w+)$/)![0]
  let locator = world.getLocator(world.page, identifier, role)
  await world.expectElement(locator, true, state === 'visible')
})
Then('a/an/the {string} (element )with (the )(text ){string} should be visible/hidden/invisible', async function (world:VitestBrowserWorld, identifier, text) {
  let state = world.info.step?.match(/(\w+)$/)![0]
  let locator = world.getLocator(world.page, identifier, 'element', text)
  await world.expectElement(locator, true, state === 'visible')
})
// Then('a/an/the {string} {word} should be attached/detatched', async function (world:VitestBrowserWorld, identifier, role) {
//   let state = world.info.step?.match(/(\w)$/)![0] as 'attached'|'detached'
//   let locator = world.getLocator(world.page, identifier, role)
//   await locator.waitFor({ state, timeout:world.worldConfig.stepTimeout })
// })
// Then('a/an/the {string} (element )with (the )(text ){string} should be attached/detatched', async function (world:VitestBrowserWorld, identifier, text) {
//   let state = world.info.step?.match(/(\w)$/)![0] as 'attached'|'detached'
//   let locator = world.getLocator(world.page, identifier, 'element', text)
//   await locator.waitFor({ state, timeout:world.worldConfig.stepTimeout })
// })

// disabled / enabled
Then('a/an/the {string} {word} should be disabled', async function (world:VitestBrowserWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await expect(locator).toBeDisabled()
})
Then('a/an/the {string} {word} should be enabled', async function (world:VitestBrowserWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await expect(locator).toBeEnabled()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be disabled', async function (world:VitestBrowserWorld, identifier, text) {
  let locator = await world.getLocator(world.page, identifier, 'element', text)
  await expect(locator).toBeDisabled()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be enabled', async function (world:VitestBrowserWorld, identifier, text) {
  let locator = await world.getLocator(world.page, identifier, 'element', text)
  await expect(locator).toBeEnabled()
})

// checked / unchecked
Then('a/an/the {string} {word} should be checked', async function (world:VitestBrowserWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await expect(locator).toBeChecked()
})
Then('a/an/the {string} {word} should be unchecked', async function (world:VitestBrowserWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await expect(locator).not.toBeChecked()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be checked', async function (world:VitestBrowserWorld, identifier, text) {
  let locator = await world.getLocator(world.page, identifier, 'element', text)
  await expect(locator).toBeChecked()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be unchecked', async function (world:VitestBrowserWorld, identifier, text) {
  let locator = await world.getLocator(world.page, identifier, 'element', text)
  await expect(locator).not.toBeChecked()
})

// focused / unfocused
Then('a/an/the {string} {word} should be focused/active', async function (world:VitestBrowserWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await expect(locator).toHaveFocus()
})
Then('a/an/the {string} {word} should be unfocused/blurred', async function (world:VitestBrowserWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await expect(locator).not.toHaveFocus()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be focused/active', async function (world:VitestBrowserWorld, identifier, text) {
  let locator = await world.getLocator(world.page, identifier, 'element', text)
  await expect(locator).toHaveFocus()
})
Then('a/an/the {string} (element )with (the )(text ){string} should be unfocused/blurred', async function (world:VitestBrowserWorld, identifier, text) {
  let locator = await world.getLocator(world.page, identifier, 'element', text)
  await expect(locator).not.toHaveFocus()
})

// Values
Then('a/an/the (value of ){string} should contain/include/be/equal {string}', async function (world:VitestBrowserWorld, identifier, expected) {
  let exact = world.info.step?.match(/ should (?:be|equal) ['"]/) ? true : false
  let locator = await world.getLocator(world.page, identifier, 'input')
  if (exact) await expect(locator).toHaveValue(expected)
  else {
    let actual = (await locator.element() as HTMLInputElement)?.value ?? ''
    await expect(actual).toContain(expected)
  }
})
Then('a/an/the (value of )(the ){string} {word} should contain/include/be/equal {string}', async function (world:VitestBrowserWorld, identifier, role, expected) {
  let exact = world.info.step?.match(/ should (?:be|equal) ['"]/) ? true : false
  let locator = await world.getLocator(world.page, identifier, role)
  if (exact) await expect(locator).toHaveValue(expected)
  else {
    let actual = (await locator.element() as HTMLInputElement)?.value ?? ''
    await expect(actual).toContain(expected)
  }
})

Then('a/an/the (value of )(the ){string} should not/NOT contain/include/be/equal {string}', async function (world:VitestBrowserWorld, identifier, expected) {
  let exact = world.info.step?.match(/ should (?:not|NOT) (?:be|equal) ['"]/) ? true : false
  let locator = await world.getLocator(world.page, identifier, 'input')
  if (exact) await expect(locator).not.toHaveValue(expected)
  else {
    let actual = (await locator.element() as HTMLInputElement)?.value ?? ''
    await expect(actual).not.toContain(expected)
  }
})
Then('a/an/the (value of )(the ){string} {word} should not/NOT contain/include/be/equal {string}', async function (world:VitestBrowserWorld, identifier, role, expected) {
  let exact = world.info.step?.match(/ should (?:not|NOT) (?:be|equal) ['"]/) ? true : false
  let locator = await world.getLocator(world.page, identifier, role)
  if (exact) await expect(locator).not.toHaveValue(expected)
  else {
    let actual = (await locator.element() as HTMLInputElement)?.value ?? ''
    await expect(actual).not.toContain(expected)
  }
})

// Visual regression testing
Then('(the )screenshot/snapshot should match', async function (world:VitestBrowserWorld) {
  await expect(world.page).toMatchImageSnapshot({
    ...world.worldConfig.screenshotOptions,
    customSnapshotsDir: world.screenshotDir,
    customSnapshotIdentifier: world.screenshotFilename,
  })
})
Then('(the )screenshot/snapshot {string} should match', async function (world:VitestBrowserWorld, name:string) {
  let explodedTags = world.info.explodedIdx ? `_(${world.info.tags.join(',')})` : ''
  await expect(world.page).toMatchImageSnapshot({
    ...world.worldConfig.screenshotOptions,
    customSnapshotsDir: world.screenshotDir,
    customSnapshotIdentifier: `${name}${explodedTags}`,
  })
})
Then('(the )screenshot/snapshot of the {string} {word} should match', async function (world:VitestBrowserWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await expect(locator).toMatchImageSnapshot({
    ...world.worldConfig.screenshotOptions,
    customSnapshotsDir: world.screenshotDir,
    customSnapshotIdentifier: world.screenshotFilename,
  })
})
Then('(the )screenshot/snapshot {string} of the {string} {word} should match', async function (world:VitestBrowserWorld, name, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  let explodedTags = world.info.explodedIdx ? `_(${world.info.tags.join(',')})` : ''
  await expect(locator).toMatchImageSnapshot({
    ...world.worldConfig.screenshotOptions,
    customSnapshotsDir: world.screenshotDir,
    customSnapshotIdentifier: `${name}${explodedTags}`,
  })
})
