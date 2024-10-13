import { Then } from "quickpickle";
import type { PlaywrightWorld } from "./PlaywrightWorld";
import { expect, Locator } from '@playwright/test'
import './snapshotMatcher'

Then('I should see {string}( somewhere)( on the page)', async function (world:PlaywrightWorld, text) {
  await expect(world.page.getByText(text)).toBeVisible()
})
Then('I should not see {string}( anywhere)( on the page)', async function (world:PlaywrightWorld, text) {
  await expect(world.page.getByText(text)).not.toBeVisible()
})

Then('I should see a(n)/the {string} with (the )(text ){string}', async function (world:PlaywrightWorld, identifier, text) {
  await expect(world.page.locator(identifier).filter({ hasText: text })).toBeVisible()
})
Then('I should not see a(n)/the {string} with (the )(text ){string}', async function (world:PlaywrightWorld, identifier, text) {
  await expect(world.page.locator(identifier).filter({ hasText: text })).not.toBeVisible()
})

Then('I should see a(n)/the {string} {word} with (the )(text ){string}', async function (world:PlaywrightWorld, identifier, role, text) {
  let locator:Locator
  if (role === 'element') locator = await world.page.locator(identifier).filter({ hasText: text })
  else locator = await world.page.getByRole(role, { name: identifier }).filter({ hasText: text })
  await expect(locator).toBeVisible()
})
Then('I should not see a(n)/the {string} {word} with (the )(text ){string}', async function (world:PlaywrightWorld, identifier, role, text) {
  let locator:Locator
  if (role === 'element') locator = await world.page.locator(identifier).filter({ hasText: text })
  else locator = await world.page.getByRole(role, { name: identifier }).filter({ hasText: text })
  await expect(locator).not.toBeVisible()
})

Then('I should see a(n)/the {string} {word}', async function (world:PlaywrightWorld, identifier, role) {
  if (role === 'element') await expect(world.page.locator(identifier)).toBeVisible()
  else await expect(world.page.getByRole(role, { name: identifier })).toBeVisible()
})
Then('I should not see a(n)/the {string} {word}', async function (world:PlaywrightWorld, identifier, role) {
  if (role === 'element') await expect(world.page.locator(identifier)).not.toBeVisible()
  else await expect(world.page.getByRole(role, { name: identifier })).not.toBeVisible()
})

Then('the (value of ){string} (value )should contain/include/be/equal {string}', async function (world:PlaywrightWorld, identifier, val) {
  let exact = world.info.step?.match(/should not (?:be|equal) ["']/) ? true : false
  let value = await (await world.page.locator(identifier)).inputValue()
  if (exact) await expect(value).toEqual(val)
  else await expect(value).toContain(val)
})
Then('the (value of ){string} (value )should not contain/include/be/equal {string}', async function (world:PlaywrightWorld, identifier, val) {
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

Then('the active element should be a/an/the {string}', async function (world:PlaywrightWorld, identifier) {
  let locator = await world.page.locator(identifier)
  try {
    await expect(locator).toBeFocused()
  }
  catch(err:any) {
    throw new Error(`The active element should be ${identifier} but it is not.`)
  }
})

Then('the active element should be a/an/the {string} {word}', async function (world:PlaywrightWorld, identifier, role) {
  try {
    let locator:Locator
    if (role === 'element') locator = await world.page.getByText(identifier, { exact:true }).or(world.page.locator(identifier))
    else locator = await world.page.getByRole(role, { name: identifier })
    await expect(locator).toBeFocused()
  }
  catch(err:any) {
    throw new Error(`The active element should be ${identifier} but it is not.`)
  }
})

Then('the user agent should contain/be {string}', async function (world:PlaywrightWorld, ua) {
  await expect(world.browser.browserType().name()).toContain(ua)
})

Then('(the )screenshot should match', async function (world:PlaywrightWorld) {
  await expect(world.page).toMatchScreenshot(`${world.playwrightConfig.screenshotDir}/${world.info.rule ? world.info.rule + '__' + world.info.scenario : world.info.scenario}__${world.info.line}.png`)
})
Then('(the )screenshot {string} should match', async function (world:PlaywrightWorld, name:string) {
  await expect(world.page).toMatchScreenshot(`${world.playwrightConfig.screenshotDir}/${name}.png`)
})

Then('the url should contain {string}', async function (world:PlaywrightWorld, url) {
  await expect(world.page.url()).toContain(url)
})