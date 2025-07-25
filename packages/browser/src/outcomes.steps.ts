import { Then } from "quickpickle";
import type { VitestBrowserWorld } from "./VitestBrowserWorld";
import { expect } from 'vitest'
import { BrowserPage, Locator } from "@vitest/browser/context";

/// <reference types="@vitest/browser/providers/playwright" />

expect.extend({
  async toBeInTheViewport(locator:Locator) {
    let frame = await locator.element()
    while (frame.parentElement && frame.tagName !== 'HTML') {
      frame = frame.parentElement
    }
    const viewport = await frame.getBoundingClientRect();
    const rect = await locator.element().getBoundingClientRect();
    if (rect) {
      const inViewport = (rect.right > 0 && rect.bottom > 0 && rect.top < viewport.height && rect.left < viewport.width);
      return {
        message: () => `expected ${locator.toString()} to be in viewport`,
        pass: inViewport,
      };
    } else {
      return {
        message: () => `could not get bounding box for ${locator.toString()}`,
        pass: false,
      };
    }
  }
})

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
// Actions
Then('{string} should have been clicked/doubleclicked/dblclicked', async function (world:VitestBrowserWorld, text) {
  let single = world.info.step?.match(/ clicked$/)
  if (single) expect(world.actions.clicks.find((el) => (el && el?.textContent === text))).not.toBeNull()
  else expect(world.actions.doubleClicks.find((el) => (el && el?.textContent === text))).not.toBeNull()
})

Then('(the ){string} {word} should have been clicked/doubleclicked/dblclicked', async function (world:VitestBrowserWorld, identifier, role) {
  let single = world.info.step?.match(/ clicked$/)
  let element = world.getLocator(world.page, identifier, role)
  if (single) expect(world.actions.clicks.find((el) => (el === element))).not.toBeNull()
  else expect(world.actions.doubleClicks.find((el) => (el === element))).not.toBeNull()
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

Then('a/an/the {string} {word} should be in(side) (of )the viewport', async function (world:VitestBrowserWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  // @ts-ignore
  await expect(locator).toBeInTheViewport()
})
Then('a/an/the {string} {word} should be out(side) (of )the viewport', async function (world:VitestBrowserWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  // @ts-ignore
  expect(locator).not.toBeInTheViewport()
})
// Then('a/an/the {string} (element )with (the )(text ){string} should be in(side) (of )the viewport', async function (world:VitestBrowserWorld, identifier, text) {
//   let locator = await world.getLocator(world.page, identifier, 'element', text)
//   await isInViewport(world, locator)
// })
// Then('a/an/the {string} (element )with (the )(text ){string} should be out(side) (of )the viewport', async function (world:VitestBrowserWorld, identifier, text) {
//   let locator = await world.getLocator(world.page, identifier, 'element', text)
//   await isInViewport(world, locator)
// })

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

Then('a/an/the (value of ){string} should be/equal {int}', async function (world:VitestBrowserWorld, identifier, expected) {
  let locator = await world.getLocator(world.page, identifier, 'input')
  await expect(locator).toHaveValue(expected)
})
Then('a/an/the (value of )(the ){string} {word} should be/equal {int}', async function (world:VitestBrowserWorld, identifier, role, expected) {
  let locator = await world.getLocator(world.page, identifier, role)
  await expect(locator).toHaveValue(expected)
})
Then('a/an/the (value of )(the ){string} should not/NOT be/equal {int}', async function (world:VitestBrowserWorld, identifier, expected) {
  let locator = await world.getLocator(world.page, identifier, 'input')
  await expect(locator).not.toHaveValue(expected)
})
Then('a/an/the (value of )(the ){string} {word} should not/NOT be/equal {int}', async function (world:VitestBrowserWorld, identifier, role, expected) {
  let locator = await world.getLocator(world.page, identifier, role)
  await expect(locator).not.toHaveValue(expected)
})

// Visual regression testing
Then('(the )screenshot/snapshot should match', async function (world:VitestBrowserWorld) {
  await world.expectScreenshotMatch(world.page)
})
Then('(the )screenshot/snapshot {string} should match', async function (world:VitestBrowserWorld, name:string) {
  await world.expectScreenshotMatch(world.page, name)
})
Then('(the )screenshot/snapshot of the {string} {word} should match', async function (world:VitestBrowserWorld, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await world.expectScreenshotMatch(locator)
})
Then('(the )screenshot/snapshot {string} of the {string} {word} should match', async function (world:VitestBrowserWorld, name, identifier, role) {
  let locator = await world.getLocator(world.page, identifier, role)
  await world.expectScreenshotMatch(locator, name)
})
