import { Given, When, Then, DataTable } from "quickpickle";
import type { PlaywrightWorld } from "./PlaywrightWorld";
import { expect } from "@playwright/test";
import { defaultScreenshotPath, getLocator, sanitizeFilepath, setValue } from "./helpers";

import path from 'node:path'
import url from 'node:url'
export const projectRoot = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..')

// ================
// Navigation

Given('I am on {string}', async function (world:PlaywrightWorld, path) {
  let url = new URL(path, world.baseUrl)
  await world.page.goto(url.href)
})
When(`I visit {string}`, async function (world:PlaywrightWorld, path) {
  let url = new URL(path, world.baseUrl)
  await world.page.goto(url.href)
})
When(`I navigate/go to {string}`, async function (world:PlaywrightWorld, path) {
  let url = new URL(path, world.baseUrl)
  await world.page.goto(url.href)
})

When('I load the file {string}', async (world:PlaywrightWorld, path) => {
  await world.page.goto(`file://${projectRoot}/${path}`)
})

When('I go back/forward/forwards', async function (world:PlaywrightWorld) {
  let direction = world.info.step?.match(/(back|forwards?)$/)![0] as 'back'|'forwards'
  if (direction === 'back') await world.page.goBack()
  else await world.page.goForward()
})

// ================
// Interaction

When('I click/press/tap/touch (on ){string}', async function (world:PlaywrightWorld, identifier) {
  let locator = world.page.getByText(identifier, { exact:true })
  await expect(locator).toBeVisible({ timeout:1000 })
  await locator.click()
})
When('I click/press/tap/touch (on )the {string} {word}', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await expect(locator).toBeVisible({ timeout:1000 })
  await locator.click()
})

When('I focus/select/activate (on ){string}', async function (world:PlaywrightWorld, identifier) {
  let locator = await world.page.getByText(identifier, { exact:true })
  await expect(locator).toBeVisible({ timeout:1000 })
  await locator.focus()
})
When('I focus/select/activate (on )the {string} {word}', async function (world:PlaywrightWorld, identifier, role) {
  let locator = await getLocator(world.page, identifier, role)
  await expect(locator).toBeVisible({ timeout:1000 })
  await locator.focus()
})

// ================
// Typing

When("for/in/on (the ){string} I type {string}", async function (world:PlaywrightWorld, identifier, value) {
  let locator = await getLocator(world.page, identifier, 'input')
  await locator.pressSequentially(value)
})
When("for/in/on (the ){string} {word} I type {string}", async function (world:PlaywrightWorld, identifier, role, value) {
  let locator = await getLocator(world.page, identifier, role)
  await locator.pressSequentially(value)
})

When('I type the following keys: {}', async function (world:PlaywrightWorld, keys:string) {
  let keyPresses = keys.split(' ')
  for (let key of keyPresses) await world.page.keyboard.press(key, { delay:world.worldConfig.keyboardDelay })
})
When("for/in/on (the ){string} I type the following keys: {}", async function (world:PlaywrightWorld, identifier, keys) {
  let locator = await getLocator(world.page, identifier, 'input')
  for (let key of keys) await locator.press(key, { delay:world.worldConfig.keyboardDelay })
})
When("for/in/on (the ){string} {word} I type the following keys: {}", async function (world:PlaywrightWorld, identifier, role, keys) {
  let locator = await getLocator(world.page, identifier, role)
  for (let key of keys) await locator.press(key, { delay:world.worldConfig.keyboardDelay })
})

// ================
// Forms

When("for/in/on (the ){string} I enter/fill/select (in ){string}", async function (world:PlaywrightWorld, identifier, value) {
  let locator = await getLocator(world.page, identifier, 'input')
  await setValue(locator, value)
})
When("for/in/on (the ){string} {word} I enter/fill/select (in ){string}", async function (world:PlaywrightWorld, identifier, role, value) {
  let locator = await getLocator(world.page, identifier, role)
  await setValue(locator, value)
})
When("for/in/on (the ){string} I enter/fill/select (in )the following( text):", async function (world:PlaywrightWorld, identifier, value) {
  let locator = await getLocator(world.page, identifier, 'input')
  await setValue(locator, value.toString())
})
When("for/in/on (the ){string} {word} I enter/fill/select (in )the following( text):", async function (world:PlaywrightWorld, identifier, role, value) {
  let locator = await getLocator(world.page, identifier, role)
  await setValue(locator, value.toString())
})
When('I enter/fill (in )the following( fields):', async function (world:PlaywrightWorld, table:DataTable) {
  let rows = table.raw()
  let hasRole = rows[0].length === 3
  for (let row of table.raw()) {
    let [identifier, role, value] = row
    if (!hasRole) {
      value = role
      role = 'input'
    }
    let locator = await getLocator(world.page, identifier, role)
    await setValue(locator, value)
  }
})

When('I check (the ){string}( radio)( checkbox)( box)', async function (world:PlaywrightWorld, indentifier) {
  let locator = await getLocator(world.page, indentifier, 'input')
  await locator.check()
})
When('I uncheck (the ){string}( checkbox)( box)', async function (world:PlaywrightWorld, indentifier) {
  let locator = await getLocator(world.page, indentifier, 'input')
  await locator.uncheck()
})

// ================
// Waiting

When('I wait for {string} to be attached/detatched/visible/hidden', async function (world:PlaywrightWorld, text) {
  let state = world.info.step?.match(/(attached|detatched|visible|hidden)$/)![0] as 'attached'|'detached'|'visible'|'hidden'
  let locator = world.page.getByText(text)
  await locator.waitFor({ state, timeout:5000 })
})
When('I wait for a/an/the {string} {word} to be attached/detatched/visible/hidden', async function (world:PlaywrightWorld, identifier, role) {
  let state = world.info.step?.match(/(attached|detatched|visible|hidden)$/)![0] as 'attached'|'detached'|'visible'|'hidden'
  let locator = await getLocator(world.page, identifier, role)
  await locator.waitFor({ state, timeout:5000 })
})

When('I wait for {int}ms', async function (world:PlaywrightWorld, num) {
  await world.page.waitForTimeout(num)
})

// ================
// Scrolling

When('I scroll down/up/left/right', async function (world:PlaywrightWorld) {
  let direction = world.info.step?.match(/(down|up|left|right)$/)![0] as 'down'|'up'|'left'|'right'
  let num = 100
  let horiz = direction.includes('t')
  if (horiz) await world.page.mouse.wheel(direction === 'right' ? num : -num, 0)
  await world.page.mouse.wheel(0, direction === 'down' ? num : -num)
})
When('I scroll down/up/left/right {int}(px)( pixels)', async function (world:PlaywrightWorld, num) {
  let direction = world.info.step?.match(/(down|up|left|right)(?= \d)/)![0] as 'down'|'up'|'left'|'right'
  let horiz = direction.includes('t')
  if (horiz) await world.page.mouse.wheel(direction === 'right' ? num : -num, 0)
  await world.page.mouse.wheel(0, direction === 'down' ? num : -num)
})

// ================
// Screenshots

Then('(I )take (a )screenshot', async function (world:PlaywrightWorld) {
  let path = sanitizeFilepath(`${projectRoot}/${defaultScreenshotPath(world)}`)
  await world.page.screenshot({ path })
})
Then('(I )take (a )screenshot named {string}', async function (world:PlaywrightWorld, name:string) {
  let explodedTags = world.info.explodedIdx ? `_(${world.info.tags.join(',')})` : ''
  let path = sanitizeFilepath(`${projectRoot}/${world.worldConfig.screenshotDir}/${name}${explodedTags}.png`)
  await world.page.screenshot({ path })
})
Then('(I )take (a )screenshot of the {string} {word}', async function (world:PlaywrightWorld, identifier:string, role:string) {
  let locator = await getLocator(world.page, identifier, role)
  let path = sanitizeFilepath(`${projectRoot}/${defaultScreenshotPath(world)}`)
  await locator.screenshot({ path })
})
Then('(I )take (a )screenshot of the {string} {word} named {string}', async function (world:PlaywrightWorld, identifier:string, role:string, name:string) {
  let locator = await getLocator(world.page, identifier, role)
  let explodedTags = world.info.explodedIdx ? `_(${world.info.tags.join(',')})` : ''
  let path = sanitizeFilepath(`${projectRoot}/${world.worldConfig.screenshotDir}/${name}${explodedTags}.png`)
  await locator.screenshot({ path })
})

// ================
// Browser size
Given('the browser size is (set to ){word}', async function (world:PlaywrightWorld, browserSizeTag:string) {
  await world.setViewportSize(browserSizeTag)
})
Given('the browser size is (set to ){int} x {int}', async function (world:PlaywrightWorld, width:number, height:number) {
  await world.page.setViewportSize({ width, height })
})
