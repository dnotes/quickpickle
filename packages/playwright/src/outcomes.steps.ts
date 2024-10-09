import { Then } from "quickpickle";
import type { PlaywrightWorld } from "./PlaywrightWorld";
import { expect } from '@playwright/test'

Then('I should see {string}', async function (world:PlaywrightWorld, text) {
  await world.page.waitForTimeout(50)
  await expect(world.page.getByText(text)).toBeVisible()
})
Then('I should not see {string}', async function (world:PlaywrightWorld, text) {
  await world.page.waitForTimeout(50)
  await expect(world.page.getByText(text)).not.toBeVisible()
})

Then('I should see a(n)/the {string} {word}', async function (world:PlaywrightWorld, identifier, role) {
  await world.page.waitForTimeout(50)
  if (role === 'element') await expect(world.page.locator(identifier)).toBeVisible()
  else await expect(world.page.getByRole(role, { name: identifier })).toBeVisible()
})
Then('I should not see a(n)/the {string} {word}', async function (world:PlaywrightWorld, identifier, role) {
  await world.page.waitForTimeout(50)
  if (role === 'element') await expect(world.page.locator(identifier)).not.toBeVisible()
  else await expect(world.page.getByRole(role, { name: identifier })).not.toBeVisible()
})

Then('I should see a(n)/the {string} with the text {string}', async function (world:PlaywrightWorld, identifier, text) {
  await world.page.waitForTimeout(50)
  await expect(world.page.locator(identifier).filter({ hasText: text })).toBeVisible()
})
Then('I should not see a(n)/the {string} with the text {string}', async function (world:PlaywrightWorld, identifier, text) {
  await world.page.waitForTimeout(50)
  await expect(world.page.locator(identifier).filter({ hasText: text })).not.toBeVisible()
})



Then('the (value of ){string} (value )should contain/include/be/equal {string}', async function (world:PlaywrightWorld, identifier, val) {
  let exact = world.info.step?.match(/should not (?:be|equal) ["']/) ? true : false
  await world.page.waitForTimeout(50)
  let value = await (await world.page.locator(identifier)).inputValue()
  if (exact) await expect(value).toEqual(val)
  else await expect(value).toContain(val)
})
Then('the (value of ){string} (value )should not contain/include/be/equal {string}', async function (world:PlaywrightWorld, identifier, val) {
  let exact = world.info.step?.match(/should not (?:be|equal) ["']/) ? true : false
  await world.page.waitForTimeout(50)
  let value = await (await world.page.locator(identifier)).inputValue()
  if (exact) await expect(value).not.toEqual(val)
  else await expect(value).not.toContain(val)
})

Then(/^the metatag for "([^"]+)" should (be|equal|contain) "(.*)"$/, async function (world:PlaywrightWorld, name, eq, value) {
  await world.page.waitForTimeout(50)
  let val:string|null

  if (name === 'title') val = await world.page.title()
  else val = await (await world.page.locator(`meta[name="${name}"]`)).getAttribute('content')

  if (value === "") await expect(val).toBeNull()
  else if (eq === 'contain') await expect(val).toContain(value)
  else await expect(val).toBe(value)
})

Then('the active element should be {string}', async function (world:PlaywrightWorld, identifier) {
  await world.page.waitForTimeout(50)
  let locator = await world.page.locator(identifier)
  await expect(locator).toBeFocused()
})

Then('the active element should be the {string} {word}', async function (world:PlaywrightWorld, identifier, role) {
  await world.page.waitForTimeout(50)
  let locator = await world.page.getByRole(role, { name: identifier })
  await expect(locator).toBeFocused()
})
