import { Locator, Page } from "playwright-core"

// Locator helper function
export async function getLocator(el:Locator|Page, identifier:string, role:string, text:string|null=null) {
  let locator:Locator
  if (role === 'element') locator = await el.locator(identifier)
  else locator = await el.getByRole(role as any, { name: identifier })
  if (text) return await locator.filter({ hasText: text })
  return locator
}

