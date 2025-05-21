import { Given, When, Then, DataTable } from "quickpickle";
import { type VitestBrowserWorld } from "./VitestBrowserWorld";
import { expect } from 'vitest';

/// <reference types="@vitest/browser/providers/playwright" />

/**
 * RENDERING COMPONENTS
 */

Given('I render (the ){string}( component)', async(world:VitestBrowserWorld, name:string) => {
  await world.render(name);
})

Given('I render (the ){string}( component) with the following props/properties:', async(world:VitestBrowserWorld, name:string, props:DataTable) => {
  let propsObj = props.raw().reduce((acc:{[key:string]:any}, row:string[]) => {
    let value
    try {
      value = JSON.parse(row[1])
    } catch (e) {
      value = row[1]
    }
    acc[row[0]] = value
    return acc
  }, {})
  await world.render(name, propsObj);
})


// ================
// Interaction

When('I click/press/tap/touch (on ){string}', async function (world:VitestBrowserWorld, identifier) {
  let locator = world.page.getByText(identifier, { exact:true })
  await locator.click({ timeout:world.worldConfig.stepTimeout })
})
When('I click/press/tap/touch (on )the {string} {word}', async function (world:VitestBrowserWorld, identifier, role) {
  let locator = world.getLocator(world.page, identifier, role)
  await locator.click({ timeout:world.worldConfig.stepTimeout })
})

When('I focus/select/activate (on ){string}', async function (world:VitestBrowserWorld, identifier) {
  let locator = world.page.getByText(identifier, { exact:true });
  (locator.element() as HTMLElement)?.focus()
  await expect(locator).toHaveFocus()
})
When('I focus/select/activate (on )the {string} {word}', async function (world:VitestBrowserWorld, identifier, role) {
  let locator = world.getLocator(world.page, identifier, role);
  (locator.element() as HTMLElement).focus()
  await expect(locator).toHaveFocus()
})

// ================
// Typing

When("for/in/on (the ){string} I type {string}", async function (world: VitestBrowserWorld, identifier: string, value: string) {
  const locator = world.getLocator(world.page, identifier, 'input');
  const element = locator.element() as HTMLElement;
  element.focus();
  await world.userEvent.keyboard(value);
})
When("for/in/on (the ){string} {word} I type {string}", async function (world: VitestBrowserWorld, identifier: string, role: string, value: string) {
  const locator = world.getLocator(world.page, identifier, role);
  const element = locator.element() as HTMLElement;
  element.focus();
  await world.userEvent.keyboard(value);
})

When('I type the following keys: {}', async function (world: VitestBrowserWorld, keys: string) {
  for (let key of keys.split(' ')) {
    if (key !== '{{' && key !== '[[' && !key.match(/^[\{\[].+[\}\]]$/)) key = `{${key}}`
    await world.userEvent.keyboard(key);
  }
})
When("for/in/on (the ){string} I type the following keys: {}", async function (world:VitestBrowserWorld, identifier: string, keys: string) {
  const locator = world.getLocator(world.page, identifier, 'input');
  const element = locator.element() as HTMLElement;
  element.focus();
  for (let key of keys.split(' ')) {
    if (key !== '{{' && key !== '[[' && !key.match(/^[\{\[].+[\}\]]$/)) key = `{${key}}`
    await world.userEvent.keyboard(key);
  }
})
When("for/in/on (the ){string} {word} I type the following keys: {}", async function (world:VitestBrowserWorld, identifier: string, role: string, keys: string) {
  const locator = world.getLocator(world.page, identifier, role);
  const element = locator.element() as HTMLElement;
  element.focus();
  for (let key of keys.split(' ')) {
    if (key !== '{{' && key !== '[[' && !key.match(/^[\{\[].+[\}\]]$/)) key = `{${key}}`
    await world.userEvent.keyboard(key);
  }
})

// ================
// Forms

When("for/in/on (the ){string} I enter/fill/select (in ){string}", async function (world:VitestBrowserWorld, identifier, value) {
  let locator = world.getLocator(world.page, identifier, 'input')
  await world.setValue(locator, value)
})
When("for/in/on (the ){string} {word} I enter/fill/select (in ){string}", async function (world:VitestBrowserWorld, identifier, role, value) {
  let locator = world.getLocator(world.page, identifier, role)
  await world.setValue(locator, value)
})
When("for/in/on (the ){string} I enter/fill/select (in )the following( text):", async function (world:VitestBrowserWorld, identifier, value) {
  let locator = world.getLocator(world.page, identifier, 'input')
  await world.setValue(locator, value.toString())
})
When("for/in/on (the ){string} {word} I enter/fill/select (in )the following( text):", async function (world:VitestBrowserWorld, identifier, role, value) {
  let locator = world.getLocator(world.page, identifier, role)
  await world.setValue(locator, value.toString())
})
When('I enter/fill (in )the following( fields):', async function (world:VitestBrowserWorld, table:DataTable) {
  let rows = table.raw()
  let hasRole = rows[0].length === 3
  for (let row of table.raw()) {
    let [identifier, role, value] = row
    if (!hasRole) {
      value = role
      role = 'input'
    }
    let locator = world.getLocator(world.page, identifier, role)
    await world.setValue(locator, value)
  }
})

When('I check (the ){string}( radio)( checkbox)( box)', async function (world:VitestBrowserWorld, indentifier) {
  let locator = world.getLocator(world.page, indentifier, 'input')
  await world.setValue(locator, 'on')
})
When('I uncheck (the ){string}( checkbox)( box)', async function (world:VitestBrowserWorld, indentifier) {
  let locator = world.getLocator(world.page, indentifier, 'input')
  await world.setValue(locator, 'off')
})

// ================
// Waiting

// When('I wait for {string} to be attached/detatched/visible/hidden', async function (world:VitestBrowserWorld, text) {
//   let state = world.info.step?.match(/(attached|detatched|visible|hidden)$/)![0] as 'attached'|'detached'|'visible'|'hidden'
//   let locator = world.page.getByText(text)
//   await locator.waitFor({ state, timeout:world.worldConfig.stepTimeout })
// })
// When('I wait for a/an/the {string} {word} to be attached/detatched/visible/hidden', async function (world:VitestBrowserWorld, identifier, role) {
//   let state = world.info.step?.match(/(attached|detatched|visible|hidden)$/)![0] as 'attached'|'detached'|'visible'|'hidden'
//   let locator = world.getLocator(world.page, identifier, role)
//   await locator.waitFor({ state, timeout:world.worldConfig.stepTimeout })
// })

When('I wait (for ){int}ms', async function (world:VitestBrowserWorld, num) {
  await world.wait(num)
})
When('I wait (for ){float} second(s)', async function (world:VitestBrowserWorld, num) {
  await world.wait(num * 1000)
})

// ================
// Scrolling

When('I scroll down/up/left/right', async function (world:VitestBrowserWorld) {
  let direction = world.info.step?.match(/(down|up|left|right)$/)![0] as 'down'|'up'|'left'|'right'
  await world.scroll(world.page, direction)
})
When('I scroll down/up/left/right {int}(px)( pixels)', async function (world:VitestBrowserWorld, num) {
  let direction = world.info.step?.match(/(down|up|left|right)(?= \d)/)![0] as 'down'|'up'|'left'|'right'
  await world.scroll(world.page, direction, num)
})
When('I scroll (the ){string} {word} down/up/left/right', async function (world:VitestBrowserWorld, identifier:string, role:string) {
  let locator = world.getLocator(world.page, identifier, role)
  let direction = world.info.step?.match(/(down|up|left|right)$/)![0] as 'down'|'up'|'left'|'right'
  await world.scroll(locator, direction)
})
When('I scroll (the ){string} {word} down/up/left/right {int}(px)( pixels)', async function (world:VitestBrowserWorld, identifier, role, num) {
  let locator = world.getLocator(world.page, identifier, role)
  let direction = world.info.step?.match(/(down|up|left|right)(?= \d)/)![0] as 'down'|'up'|'left'|'right'
  await world.scroll(locator, direction, num)
})

// ================
// Screenshots

Then('(I )take (a )screenshot', async function (world:VitestBrowserWorld) {
  await world.screenshot()
})
Then('(I )take (a )screenshot named {string}', async function (world:VitestBrowserWorld, name:string) {
  await world.screenshot({ name })
})
Then('(I )take (a )screenshot of the {string} {word}', async function (world:VitestBrowserWorld, identifier:string, role:string) {
  let locator = world.getLocator(world.page, identifier, role)
  await world.screenshot({ locator })
})
Then('(I )take (a )screenshot of the {string} {word} named {string}', async function (world:VitestBrowserWorld, identifier:string, role:string, name:string) {
  let locator = world.getLocator(world.page, identifier, role)
  await world.screenshot({ locator, name })
})
