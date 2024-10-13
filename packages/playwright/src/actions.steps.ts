import { Given, When, Then, DataTable } from "quickpickle";
import type { PlaywrightWorld } from "./PlaywrightWorld";
import path from 'node:path'
import url from 'node:url'
import type { Locator } from "playwright/test";

export const projectRoot = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..')

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

When('I click/press/tap/touch (on ){string}', async function (world:PlaywrightWorld, identifier) {
  await world.page.getByText(identifier, { exact:true }).click()
})

When('I click/press/tap/touch (on )the {string} {word}', async function (world:PlaywrightWorld, identifier, role) {
  let locator:Locator
  if (role === 'element') locator = await world.page.getByText(identifier, { exact:true }).or(world.page.locator(identifier))
  else locator = await world.page.getByRole(role, { name: identifier })
  await locator.click()
})

When('I focus/select/activate (on ){string}', async function (world:PlaywrightWorld, identifier) {
  let locator = await world.page.getByText(identifier, { exact:true }).or(world.page.locator(identifier))
  await locator.focus()
})

When('I focus/select/activate (on )the {string} {word}', async function (world:PlaywrightWorld, identifier, role) {
  let locator:Locator
  if (role === 'element') locator = await world.page.getByText(identifier, { exact:true }).or(world.page.locator(identifier))
  else locator = await world.page.getByRole(role, { name: identifier })
  await locator.focus()
})

When("for (the ){string} I enter/fill (in ){string}", async function (world:PlaywrightWorld, identifier, text) {
  let locator = await world.page.getByLabel(identifier).or(world.page.getByPlaceholder(identifier)).or(world.page.locator(identifier))
  await locator.fill(text)
})
When("for (the ){string} I enter/fill (in )the following( text):", async function (world:PlaywrightWorld, identifier, text) {
  let locator = await world.page.getByLabel(identifier).or(world.page.getByPlaceholder(identifier)).or(world.page.locator(identifier))
  await locator.fill(text)
})

When('I enter/fill (in )the following( fields):', async function (world:PlaywrightWorld, table:DataTable) {
  for (let row of table.raw()) {
    let [identifier, text] = row
    let locator = await world.page.getByLabel(identifier).or(world.page.getByPlaceholder(identifier)).or(world.page.locator(identifier))
    let tag = await locator.evaluate(e => e.tagName.toLowerCase())
    let type = await locator.getAttribute('type')
    if (tag === 'select') {
      await locator.selectOption(text)
    }
    else if (type === 'checkbox' || type === 'radio') {
      let checked:boolean = (['','false','no','unchecked','null','undefined','0']).includes(text.toLowerCase()) ? false : true
      await locator.setChecked(checked)
    }
    else {
      await locator.fill(text)
    }
  }
})

When('I wait for {string} to be attached/detatched/visible/hidden', async function (world:PlaywrightWorld, identifier) {
  let state = world.info.step?.match(/(attached|detatched|visible|hidden)$/)![0] as 'attached'|'detached'|'visible'|'hidden'
  let locator = await world.page.getByText(identifier, { exact:true }).or(world.page.getByLabel(identifier)).or(world.page.locator(identifier))
  await locator.waitFor({ state })
})

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

When('I type the following keys: {}', async function (world:PlaywrightWorld, keys:string) {
  let keyPresses = keys.split(' ')
  for (let key of keyPresses) {
    await world.page.keyboard.press(key)
  }
})

When('I go back/forwards?', async function (world:PlaywrightWorld) {
  let direction = world.info.step?.match(/(back|forwards?)$/)![0] as 'back'|'forwards'
  if (direction === 'back') await world.page.goBack()
  else await world.page.goForward()
})

Then('(I )take (a )screenshot', async function (world:PlaywrightWorld) {
  await world.page.screenshot({ path: `${projectRoot}/${world.playwrightConfig.screenshotDir}/${world.info.rule ? world.info.rule + '__' + world.info.scenario : world.info.scenario}__${world.info.line}.png`.replace(/\/\//g,'/') })
})
Then('(I )take (a )screenshot named {string}', async function (world:PlaywrightWorld, name:string) {
  await world.page.screenshot({ path: `${projectRoot}/${world.playwrightConfig.screenshotDir}/${name}.png`.replace(/\/\//g,'/') })
})
