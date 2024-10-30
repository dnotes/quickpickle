import { Locator, Page } from "playwright-core"
import { PlaywrightWorld } from "./PlaywrightWorld"

// Locator helper function
export async function getLocator(el:Locator|Page, identifier:string, role:string, text:string|null=null) {
  let locator:Locator
  if (role === 'element') locator = await el.locator(identifier)
  else if (role === 'input') locator = await el.getByLabel(identifier).or(el.getByPlaceholder(identifier))
  else locator = await el.getByRole(role as any, { name: identifier })
  if (text) return await locator.filter({ hasText: text })
  return locator
}

export async function setValue(locator:Locator, value:string|any) {
  let { tag, type, role } = await locator.evaluate((el) => ({ tag:el.tagName.toLowerCase(), type:el.getAttribute('type')?.toLowerCase(), role:el.getAttribute('role')?.toLowerCase() }))
  if (tag === 'select') {
    let values = value.split(/\s*(?<!\\),\s*/).map((v:string) => v.replace(/\\,/g, ','))
    await locator.selectOption(values)
  }
  else if (type === 'checkbox' || type === 'radio' || role === 'checkbox') {
    let check = !( ['false','no','unchecked','','null','undefined','0'].includes(value.toString().toLowerCase()) )
    if (check) await locator.check()
    else await locator.uncheck()
  }
  else {
    await locator.fill(value)
  }
}

export async function testMetatag(page:Page, name:string, expected:string, exact:boolean, expectMatching = true) {
  let actual:string|null

  if (name === 'title') actual = await page.title()
  else actual = await (await page.locator(`meta[name="${name}"]`)).getAttribute('content')

  let matches = exact ?  actual === expected : actual?.includes(expected)

  if (matches !== expectMatching) {
    let word = exact ? 'exactly match' : 'contain'
    let not = expectMatching ? '' : 'not '
    throw new Error(`Expected ${name} metatag ${not }to ${word} '${expected}' but got '${actual}'`)
  }
}

export function sanitizeFilepath(filepath:string) {
  return filepath.replace(/\/\/+/g, '/').replace(/\/[\.~]+\//g, '/')
}

export function defaultScreenshotPath(world:PlaywrightWorld) {
  return `${world.worldConfig.screenshotDir}/${world.toString().replace(/^.+?Feature: /, 'Feature: ').replace(' ' + world.info.step, '')}.png`
}