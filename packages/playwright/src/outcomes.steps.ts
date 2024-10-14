import { Then } from "quickpickle";
import type { PlaywrightWorld } from "./PlaywrightWorld";
import { expect, Locator, Page } from '@playwright/test'
import './snapshotMatcher'

async function getLocator(el:Locator|Page, identifier:string, role:string, text:string|null=null) {
  let locator:Locator
  if (role === 'element') locator = await el.locator(identifier)
  else locator = await el.getByRole(role as any, { name: identifier })
  if (text) locator = await locator.filter({ hasText: text })
  return locator
}

Then('I should see {string}( somewhere)( on the page)', async function (world:PlaywrightWorld, text) {
  await expect(world.page.getByText(text)).toBeVisible()
})
Then('I should not see {string}( anywhere)( on the page)', async function (world:PlaywrightWorld, text) {
  await expect(world.page.getByText(text)).not.toBeVisible()
})

Then('I should see a(n)/the {string} with (the )(text ){string}', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await getLocator(world.page, identifier, 'element', text)
  await expect(locator).toBeVisible()
})
Then('I should not see a(n)/the {string} with (the )(text ){string}', async function (world:PlaywrightWorld, identifier, text) {
  let locator = await getLocator(world.page, identifier, 'element', text)
  await expect(locator).not.toBeVisible()
})

Then('I should see a(n)/the {string} {word} with (the )(text ){string}', async function (world:PlaywrightWorld, identifier, role, text) {
  let locator = await getLocator(world.page, identifier, role, text)
  await expect(locator).toBeVisible()
})
Then('I should not see a(n)/the {string} {word} with (the )(text ){string}', async function (world:PlaywrightWorld, identifier, role, text) {
  let locator = await getLocator(world.page, identifier, role, text)
  await expect(locator).not.toBeVisible()
})

Then('I should see a(n)/the {string} {word}', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await expect(locator).toBeVisible()
})
Then('I should not see a(n)/the {string} {word}', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await expect(locator).not.toBeVisible()
})


Then('a/an/the {string} {word} should be disabled', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await expect(locator).toBeDisabled()
})
Then('a/an/the {string} {word} should be enabled', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await expect(locator).toBeEnabled()
})
Then('a/an/the {string} {word} should be checked', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await expect(locator).toBeChecked()
})
Then('a/an/the  {string} {word} should be unchecked', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await expect(locator).not.toBeChecked()
})
Then('a/an/the {string} {word} should be focused/active', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await expect(locator).toBeFocused()
})
Then('a/an/the {string} {word} should be unfocused/blurred', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await expect(locator).not.toBeFocused()
})
Then('a/an/the {string} {word} should be visible', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await expect(locator).toBeVisible()
})
Then('a/an/the {string} {word} should be hidden/invisible', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await expect(locator).not.toBeVisible()
})
Then('a/an/the {string} {word} with (the )(text ){string} should be disabled', async function (world:PlaywrightWorld, identifier, role, text) {
  let locator = await getLocator(world.page, identifier, role, text)
  await expect(locator).toBeDisabled()
})
Then('a/an/the {string} {word} with (the )(text ){string} should be enabled', async function (world:PlaywrightWorld, identifier, role, text) {
  let locator = await getLocator(world.page, identifier, role, text)
  await expect(locator).toBeEnabled()
})
Then('a/an/the {string} {word} with (the )(text ){string} should be checked', async function (world:PlaywrightWorld, identifier, role, text) {
  let locator = await getLocator(world.page, identifier, role, text)
  await expect(locator).toBeChecked()
})
Then('a/an/the {string} {word} with (the )(text ){string} should be unchecked', async function (world:PlaywrightWorld, identifier, role, text) {
  let locator = await getLocator(world.page, identifier, role, text)
  await expect(locator).not.toBeChecked()
})
Then('a/an/the {string} {word} with (the )(text ){string} should be focused', async function (world:PlaywrightWorld, identifier, role, text) {
  let locator = await getLocator(world.page, identifier, role, text)
  await expect(locator).toBeFocused()
})
Then('a/an/the {string} {word} with (the )(text ){string} should be unfocused/blurred', async function (world:PlaywrightWorld, identifier, role, text) {
  let locator = await getLocator(world.page, identifier, role, text)
  await expect(locator).not.toBeFocused()
})
Then('a/an/the {string} {word} with (the )(text ){string} should be visible', async function (world:PlaywrightWorld, identifier, role, text) {
  let locator = await getLocator(world.page, identifier, role, text)
  await expect(locator).toBeVisible()
})
Then('a/an/the {string} {word} with (the )(text ){string} should be hidden/invisible', async function (world:PlaywrightWorld, identifier, role, text) {
  let locator = await getLocator(world.page, identifier, role, text)
  await expect(locator).not.toBeVisible()
})

Then('a/an/the (value of ){string} (value )should contain/include/be/equal {string}', async function (world:PlaywrightWorld, identifier, val) {
  let exact = world.info.step?.match(/should not (?:be|equal) ["']/) ? true : false
  let value = await (await world.page.locator(identifier)).inputValue()
  if (exact) await expect(value).toEqual(val)
  else await expect(value).toContain(val)
})
Then('a/an/the (value of ){string} (value )should not contain/include/be/equal {string}', async function (world:PlaywrightWorld, identifier, val) {
  let exact = world.info.step?.match(/should not (?:be|equal) ["']/) ? true : false
  let value = await (await world.page.locator(identifier)).inputValue()
  if (exact) await expect(value).not.toEqual(val)
  else await expect(value).not.toContain(val)
})

Then(/^the metatag for "([^"]+)" should (be|equal|contain) "(.*)"$/, async function (world:PlaywrightWorld, name, eq, value) {
  let val:string|null

  if (name === 'title') val = await world.page.title()
  else val = await (await world.page.locator(`meta[name="${name}"]`)).getAttribute('content')

  if (value === "") await expect(val).toBeNull()
  else if (eq === 'contain') await expect(val).toContain(value)
  else await expect(val).toBe(value)
})

Then('(the )screenshot should match', async function (world:PlaywrightWorld) {
  await expect(world.page).toMatchScreenshot(`${world.playwrightConfig.screenshotDir}/${world.info.rule ? world.info.rule + '__' + world.info.scenario : world.info.scenario}__${world.info.line}.png`)
})
Then('(the )screenshot {string} should match', async function (world:PlaywrightWorld, name:string) {
  await expect(world.page).toMatchScreenshot(`${world.playwrightConfig.screenshotDir}/${name}.png`)
})

Then('the user agent should contain/be {string}', async function (world:PlaywrightWorld, ua) {
  await expect(world.browser.browserType().name()).toContain(ua)
})
Then('the url should contain {string}', async function (world:PlaywrightWorld, url) {
  await expect(world.page.url()).toContain(url)
})