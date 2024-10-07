import { Given, When, Then, DataTable } from '@cucumber/cucumber'
import { PlaywrightWorldInterface } from './PlaywrightWorld.js'
import { expect } from '@playwright/test'

Given('I am on {string}', async function (this:PlaywrightWorldInterface, url) {
  await this.page.goto(url)
})
When(`I visit {string}`, async function (this:PlaywrightWorldInterface, url) {
  await this.page.goto(url)
})
When(`I navigate/go to {string}`, async function (this:PlaywrightWorldInterface, url) {
  await this.page.goto(url)
})


When('I click/press/tap/touch {string}', async function (this:PlaywrightWorldInterface, identifier) {
  let locator = await this.page.getByText(identifier).or(this.page.locator(identifier))
  await locator.click()
})

When('I click/press/tap/touch the {string} {word}', async function (this:PlaywrightWorldInterface, identifier, role) {
  let locator = await this.page.getByRole(role, { name: identifier })
  await locator.click()
})

When('I focus/select/activate {string}', async function (this:PlaywrightWorldInterface, identifier) {
  let locator = await this.page.locator(identifier)
  await locator.focus()
})

When('I focus/select/activate the {string} {word}', async function (this:PlaywrightWorldInterface, identifier, role) {
  let locator = await this.page.getByRole(role, { name: identifier })
  await locator.focus()
})

When("for {string} I enter {string}", async function (this:PlaywrightWorldInterface, identifier, text) {
  let locator = await this.page.getByLabel(identifier).or(this.page.getByPlaceholder(identifier)).or(this.page.locator(identifier))
  await locator.fill(text)
})

When('I fill in the following( fields):', async function (this:PlaywrightWorldInterface, table:DataTable) {
  for (let row of table.raw()) {
    let [identifier, text] = row
    let locator = await this.page.getByLabel(identifier).or(this.page.getByPlaceholder(identifier)).or(this.page.locator(identifier))
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

When(/^I wait for "([^"]+)" to be (attached|detatched|visible|hidden)$/, async function (this:PlaywrightWorldInterface, identifier, state) {
  let locator = await this.page.getByText(identifier).or(this.page.getByLabel(identifier)).or(this.page.locator(identifier))
  await locator.waitFor({ state })
})

When(/^I scroll (down|up|left|right)$/, async function (this:PlaywrightWorldInterface, direction) {
  let num = 100
  let horiz = direction.includes('t')
  if (horiz) await this.page.mouse.wheel(direction === 'right' ? num : -num, 0)
  await this.page.mouse.wheel(0, direction === 'down' ? num : -num)
})
When(/^I scroll (down|up|left|right) (\d*)(?:px| pixels?)$/, async function (this:PlaywrightWorldInterface, direction, int) {
  let num = parseInt(int || '100')
  let horiz = direction.includes('t')
  if (horiz) await this.page.mouse.wheel(direction === 'right' ? num : -num, 0)
  await this.page.mouse.wheel(0, direction === 'down' ? num : -num)
})

When('I type the following keys: {}', async function (this:PlaywrightWorldInterface, keys:string) {
  let keyPresses = keys.split(' ')
  for (let key of keyPresses) {
    await this.page.keyboard.press(key)
  }
})

When(/^I go (back|forwards?)$/, async function (this:PlaywrightWorldInterface, direction) {
  if (direction === 'back') await this.page.goBack()
  else await this.page.goForward()
})

Then('I should see {string}', async function (this:PlaywrightWorldInterface, text) {
  await expect(this.page.getByText(text).or(this.page.locator(text))).toBeVisible()
})

Then('I should not see {string}', async function (this:PlaywrightWorldInterface, text) {
  await expect(this.page.getByText(text).or(this.page.locator(text))).not.toBeVisible()
})

Then('I should see a(n) {string} with the text {string}', async function (this:PlaywrightWorldInterface, identifier, text) {
  await expect(this.page.locator(identifier, { hasText: text })).toBeVisible()
})

Then('I should not see a(n) {string} with the text {string}', async function (this:PlaywrightWorldInterface, identifier, text) {
  await expect(this.page.locator(identifier, { hasText: text })).not.toBeVisible()
})

Then(/^the metatag for "([^"]+)" should (be|equal|contain) "(.*)"$/, async function (this:PlaywrightWorldInterface, name, eq, value) {
  let val:string|null

  if (name === 'title') val = await this.page.title()
  else val = await (await this.page.locator(`meta[name="${name}"]`)).getAttribute('content')

  if (value === "") await expect(val).toBeNull()
  else if (eq === 'contain') await expect(val).toContain(value)
  else await expect(val).toBe(value)
})

Then('take a screenshot', async function (this:PlaywrightWorldInterface) {
  await this.page.screenshot({ path: `${this.screenshots}/${this.scenario}__${this.step}.png`.replace(/\/\//g,'/') })
})

Then('The active element should be {string}', async function (this:PlaywrightWorldInterface, identifier) {
  let locator = await this.page.locator(identifier)
  await expect(locator).toBeFocused()
})

Then('The active element should be the {string} {word}', async function (this:PlaywrightWorldInterface, identifier, role) {
  let locator = await this.page.getByRole(role, { name: identifier })
  await expect(locator).toBeFocused()
})