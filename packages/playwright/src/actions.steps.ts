import { Given, When, Then, DataTable } from "quickpickle";
import type { PlaywrightWorld } from "./PlaywrightWorld";
import { expect } from '@playwright/test'

// ================
// Navigation

Given('I am on the home/front page', async function (world:PlaywrightWorld) {
  await world.page.goto(world.baseUrl.toString(), { timeout:world.worldConfig.stepTimeout })
}, -10)
Given('I am on {string}', async function (world:PlaywrightWorld, path) {
  let url = new URL(path, world.baseUrl)
  await world.page.goto(url.href, { timeout:world.worldConfig.stepTimeout })
}, -10)
When(`I visit {string}`, async function (world:PlaywrightWorld, path) {
  let url = new URL(path, world.baseUrl)
  await world.page.goto(url.href, { timeout:world.worldConfig.stepTimeout })
}, -10)
When(`I navigate/go to {string}`, async function (world:PlaywrightWorld, path) {
  let url = new URL(path, world.baseUrl)
  await world.page.goto(url.href, { timeout:world.worldConfig.stepTimeout })
}, -10)

When('I load the file {string}', async (world:PlaywrightWorld, filepath) => {
  filepath = world.fullPath(filepath).replace(/^.*?\/+/, 'file:///');
  await world.page.goto(filepath, { timeout:world.worldConfig.stepTimeout })
}, -10)

When('I go back/forward/forwards', async function (world:PlaywrightWorld) {
  let direction = world.info.step?.match(/(back|forwards?)$/)![0] as 'back'|'forwards'
  if (direction === 'back') await world.page.goBack({ timeout:world.worldConfig.stepTimeout })
  else await world.page.goForward({ timeout:world.worldConfig.stepTimeout })
}, -10)

// ================
// Identities

Given('(as )a/an/the (user ){string}', async function (world:PlaywrightWorld, identity) {
  await world.setIdentity(identity)
}, -10)
Given('(as )a/an/the {string} user/role/browser/identity', async function (world:PlaywrightWorld, identity) {
  await world.setIdentity(identity)
}, -10)
Given('I am {string}', async function (world:PlaywrightWorld, identity) {
  await world.setIdentity(identity)
}, -10)
Given('I am a/an/the (user ){string}', async function (world:PlaywrightWorld, identity) {
  await world.setIdentity(identity)
}, -10)
Given('I am a/an/the {string} user/role/browser/identity', async function (world:PlaywrightWorld, identity) {
  await world.setIdentity(identity)
}, -10)
Then('as {string}', async function (world:PlaywrightWorld, identity) {
  await world.setIdentity(identity)
}, -10)

// ================
// Interaction

When('I click/press/tap/touch (on ){string}', async function (world:PlaywrightWorld, identifier) {
  let locator = world.page.getByText(identifier, { exact:true })
  await locator.click({ timeout:world.worldConfig.stepTimeout })
}, -10)
When('I click/press/tap/touch (on )the {string} {word}', async function (world:PlaywrightWorld, identifier, role) {
  let locator = world.getLocator(world.page, identifier, role)
  await locator.click({ timeout:world.worldConfig.stepTimeout })
}, -10)

When('I focus/select/activate (on ){string}', async function (world:PlaywrightWorld, identifier) {
  let locator = await world.page.getByText(identifier, { exact:true })
  await locator.focus({ timeout:world.worldConfig.stepTimeout })
  await expect(locator).toBeFocused()
}, -10)
When('I focus/select/activate (on )the {string} {word}', async function (world:PlaywrightWorld, identifier, role) {
  let locator = world.getLocator(world.page, identifier, role)
  await locator.focus({ timeout:world.worldConfig.stepTimeout })
  await expect(locator).toBeFocused()
}, -10)

// ================
// Typing

When("for/in/on (the ){string} I type {string}", async function (world:PlaywrightWorld, identifier, value) {
  let locator = world.getLocator(world.page, identifier, 'input')
  await locator.pressSequentially(value, { delay:world.worldConfig.keyboardDelay, timeout:world.worldConfig.stepTimeout })
}, -10)
When("for/in/on (the ){string} {word} I type {string}", async function (world:PlaywrightWorld, identifier, role, value) {
  let locator = world.getLocator(world.page, identifier, role)
  await locator.pressSequentially(value, { delay:world.worldConfig.keyboardDelay, timeout:world.worldConfig.stepTimeout })
}, -10)

When('I type the following keys: {}', async function (world:PlaywrightWorld, keys:string) {
  let keyPresses = keys.split(' ')
  for (let key of keyPresses) await world.page.keyboard.press(key, { delay:world.worldConfig.keyboardDelay })
}, -10)
When("for/in/on (the ){string} I type the following keys: {}", async function (world:PlaywrightWorld, identifier, keys) {
  let locator = world.getLocator(world.page, identifier, 'input')
  for (let key of keys.split(' ')) await locator.press(key, { delay:world.worldConfig.keyboardDelay, timeout:world.worldConfig.stepTimeout })
}, -10)
When("for/in/on (the ){string} {word} I type the following keys: {}", async function (world:PlaywrightWorld, identifier, role, keys) {
  let locator = world.getLocator(world.page, identifier, role)
  for (let key of keys.split(' ')) await locator.press(key, { delay:world.worldConfig.keyboardDelay, timeout:world.worldConfig.stepTimeout })
}, -10)

// ================
// Forms

When("for/in/on (the ){string} I enter/fill/select (in ){string}", async function (world:PlaywrightWorld, identifier, value) {
  let locator = world.getLocator(world.page, identifier, 'input')
  await world.setValue(locator, value)
}, -10)
When("for/in/on (the ){string} {word} I enter/fill/select (in ){string}", async function (world:PlaywrightWorld, identifier, role, value) {
  let locator = world.getLocator(world.page, identifier, role)
  await world.setValue(locator, value)
}, -10)
When("for/in/on (the ){string} I enter/fill/select (in )the following( text):", async function (world:PlaywrightWorld, identifier, value) {
  let locator = world.getLocator(world.page, identifier, 'input')
  await world.setValue(locator, value.toString())
}, -10)
When("for/in/on (the ){string} {word} I enter/fill/select (in )the following( text):", async function (world:PlaywrightWorld, identifier, role, value) {
  let locator = world.getLocator(world.page, identifier, role)
  await world.setValue(locator, value.toString())
}, -10)
When('I enter/fill (in )the following( fields):', async function (world:PlaywrightWorld, table:DataTable) {
  let rows = table.raw()
  let hasRole = rows[0].length === 3
  for (let row of table.raw()) {
    let [identifier, role, value] = row
    if (!hasRole) {
      value = role
      role = 'input'
    }
    let locator = world.getLocator(world.page, identifier, role as any)
    await world.setValue(locator, value)
  }
}, -10)

When('I check (the ){string}( radio)( checkbox)( box)', async function (world:PlaywrightWorld, indentifier) {
  let locator = world.getLocator(world.page, indentifier, 'input')
  await world.setValue(locator, 'on')
}, -10)
When('I uncheck (the ){string}( checkbox)( box)', async function (world:PlaywrightWorld, indentifier) {
  let locator = world.getLocator(world.page, indentifier, 'input')
  await world.setValue(locator, 'off')
}, -10)

// ================
// Waiting

When('I wait for {string} to be attached/detatched/visible/hidden', async function (world:PlaywrightWorld, text) {
  let state = world.info.step?.match(/(attached|detatched|visible|hidden)$/)![0] as 'attached'|'detached'|'visible'|'hidden'
  let locator = world.page.getByText(text)
  await locator.waitFor({ state, timeout:world.worldConfig.stepTimeout })
}, -10)
When('I wait for a/an/the {string} {word} to be attached/detatched/visible/hidden', async function (world:PlaywrightWorld, identifier, role) {
  let state = world.info.step?.match(/(attached|detatched|visible|hidden)$/)![0] as 'attached'|'detached'|'visible'|'hidden'
  let locator = world.getLocator(world.page, identifier, role)
  await locator.waitFor({ state, timeout:world.worldConfig.stepTimeout })
}, -10)

When('I wait (for ){int}ms', async function (world:PlaywrightWorld, num) {
  await world.page.waitForTimeout(num)
}, -10)
When('I wait (for ){float} second(s)', async function (world:PlaywrightWorld, num) {
  await world.page.waitForTimeout(num * 1000)
}, -10)

// ================
// Scrolling

When('I scroll down/up/left/right', async function (world:PlaywrightWorld) {
  let direction = world.info.step?.match(/(down|up|left|right)$/)![0] as 'down'|'up'|'left'|'right'
  await world.scroll(world.page, direction)
}, -10)
When('I scroll down/up/left/right {int}(px)( pixels)', async function (world:PlaywrightWorld, num) {
  let direction = world.info.step?.match(/(down|up|left|right)(?= \d)/)![0] as 'down'|'up'|'left'|'right'
  await world.scroll(world.page, direction, num)
}, -10)

// ================
// Screenshots

Then('(I )take (a )screenshot', async function (world:PlaywrightWorld) {
  await world.screenshot()
}, -10)
Then('(I )take (a )screenshot named {string}', async function (world:PlaywrightWorld, name:string) {
  await world.screenshot({ name })
}, -10)
Then('(I )take (a )screenshot of the {string} {word}', async function (world:PlaywrightWorld, identifier:string, role:string) {
  let locator = world.getLocator(world.page, identifier, role as any)
  await world.screenshot({ locator })
}, -10)
Then('(I )take (a )screenshot of the {string} {word} named {string}', async function (world:PlaywrightWorld, identifier:string, role:string, name:string) {
  let locator = world.getLocator(world.page, identifier, role as any)
  await world.screenshot({ locator, name })
}, -10)

// ================
// Browser size
Given('the browser size is (set to ){word}', async function (world:PlaywrightWorld, browserSizeTag:string) {
  await world.setViewportSize(browserSizeTag)
}, -10)
Given('the browser size is (set to ){int} x {int}', async function (world:PlaywrightWorld, width:number, height:number) {
  await world.page.setViewportSize({ width, height })
}, -10)
