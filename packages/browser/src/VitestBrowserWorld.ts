import { Before, DataTable, QuickPickleWorld, QuickPickleWorldInterface } from 'quickpickle';
import type { BrowserPage, Locator, UserEvent, ScreenshotOptions } from '@vitest/browser/context'
import { defaultsDeep } from 'lodash-es'
import type { TestContext } from 'vitest';
import { InfoConstructor } from 'quickpickle/dist/world';

/// <reference types="@vitest/browser/providers/playwright" />


export const variantTypes = ['string','number','boolean','checkboxes','select','radios','object'] as const
export type VariantType = typeof variantTypes[number]
export type ComponentVariant = {
  prop: string
  type: VariantType
  values: Array<string|number>
}

export function isVariantType(type:any):type is VariantType {
  return variantTypes.includes(type)
}

export type CachedComponent = {
  name: string
  filepath: string
  testpath: string
  variants: ComponentVariant[]
  group?: string
}

export type VitestWorldConfig = {
  componentDir?:        string;
  screenshotDir?:       string;
  screenshotOptions?:   Partial<ScreenshotOptions>;
  storybookDir?:        string;
}

export const defaultVitestWorldConfig:VitestWorldConfig = {
  componentDir: '',               // directory in which components are kept, relative to project root
  screenshotDir: 'screenshots',   // directory in which to save screenshots, relative to project root (default: "screenshots")
  screenshotOptions: {},          // options for the default screenshot comparisons
  storybookDir: 'storybook',      // directory in which storybook is saved, relative to project root
}

export type VitestBrowserWorldInterface = QuickPickleWorldInterface & {
  render: (name:string|any, props?:any, renderOptions?:any)=>Promise<void>;
  renderFn: (component:any, props?:any, renderOptions?:any)=>void|Promise<void>;
  cleanup: ()=>Promise<void>;
  cleanupFn: ()=>void|Promise<void>;
  page: BrowserPage;
  userEvent: UserEvent
}

export class VitestBrowserWorld extends QuickPickleWorld implements VitestBrowserWorldInterface {

  renderFn: (component:any, props:any, renderOptions:any)=>void;
  cleanupFn: ()=>void;
  page!: BrowserPage;
  userEvent!: UserEvent;

  constructor(context:TestContext, info:InfoConstructor) {
    info = defaultsDeep(info || {}, { config: { worldConfig: defaultVitestWorldConfig } } )
    super(context, info);
    if (!info.config.worldConfig.screenshotDir && info.config.worldConfig?.screenshotOptions?.customSnapshotsDir) {
      this.info.config.worldConfig.screenshotDir = info.config.worldConfig.screenshotOptions.customSnapshotsDir
    }
    this.renderFn = ()=>{};
    this.cleanupFn = ()=>{};
    this.common.componentsCache = new Map() as Map<string, CachedComponent>
  }

  async init() {
    let browserContext = await import('@vitest/browser/context')
    this.page = browserContext.page;
    this.userEvent = browserContext.userEvent;
  }

  async render(name:string|any, props?:any, renderOptions?:any) {
    let component = typeof name === 'string'
      ? await import(`${this.projectRoot}/${this.worldConfig.componentDir}/${name}`.replace(/\/+/g, '/') /* @vite-ignore */ )
      : name
    await this.renderFn(component, props, renderOptions)
  };

  async cleanup() {
    await this.cleanupFn()
  }

  sanitizeFilepath(filepath:string) {
    return filepath.replace(/\/\/+/g, '/').replace(/\/[\.~]+\//g, '/')
  }

  get screenshotDir() {
    return this.sanitizeFilepath(`${this.projectRoot}/${this.worldConfig.screenshotDir}`)
  }

  get screenshotFilename() {
    return `${this.toString().replace(/^.+?Feature: /, '').replace(' ' + this.info.step, '')}.png`
  }

  get storybookDir() {
    // TODO: transliterate the paths
    return this.sanitizeFilepath(`${this.projectRoot}/${this.worldConfig.storybookDir}/${this.info.feature.replace(/.+?: /, '').replace(/\W/g, '-')}`)
  }

  get storybookFilename() {
    return this.info.scenario.replace(/^.+?: /, '').replace(/\W/g, '-')
  }

  get componentDir() {
    return this.sanitizeFilepath(`${this.projectRoot}/${this.worldConfig.componentDir}`)
  }

  /**
    * Gets a locator based on a certain logic
    * @example getLocator(page, 'Cancel', 'button') => page.getByRole('button', { name: 'Cancel' })
    * @example getLocator(page, 'Search', 'input') => page.getByLabel('Search').or(page.getByPlaceholder('Search'))
    * @example getLocator(page, 'ul.fourteen-points li', 'element', 'Open covenants of peace') => page.locator('ul.fourteen-points li').filter({ hasText: 'Open covenants of peace' })
    *
    * @param el The locator or page inside which to get a new locator
    * @param identifier The value, label, placeholder, or css selector, depending on role
    * @param role An ARIA role, "input", or "element"
    * @param text Optional text to match inside the locator
    * @returns Promise<void>
    */
  getLocator(el:Locator|BrowserPage, identifier:string, role:string|'element'|'input', text:string|null=null) {
    let locator:Locator
    if (role === 'element') throw new Error('Using "element" for CSS selectors is not yet supported; use an aria role or "input" instead.')
    else if (role === 'input') locator = el.getByLabelText(identifier).or(el.getByPlaceholder(identifier))
    else locator = el.getByRole(role as any, { name: identifier })
    if (text && role !== 'input') return locator.filter({ hasText: text })
    return locator
  }

  /**
    * Sets a value on a form element based on its type (select, checkbox/radio, or other input)
    * @example setValue(locator, "Option 1, Option 2") => Selects multiple options in a select element
    * @example setValue(locator, "true") => Checks a checkbox/radio button
    * @example setValue(locator, "false") => Unchecks a checkbox/radio button
    * @example setValue(locator, "Some text") => Fills a text input with "Some text"
    *
    * @param locator The Playwright locator for the form element
    * @param value The value to set - can be string or other value type
    * @returns Promise<void>
    */
  async setValue(locator:Locator, value:string|any) {
    let el = await locator.element()
    let tag = el.tagName.toLowerCase()
    if (!tag) throw new Error(`Could not find element with locator: ${locator.toString()}`)
    if (tag === 'select') {
      let values = value.split(/\s*(?<!\\),\s*/).map((v:string) => v.replace(/\\,/g, ','))
      await locator.selectOptions(values)
    }
    else if (isCheckboxOrRadio(el)) {
      let check = !( ['false','no','unchecked','','null','undefined','0'].includes(value.toString().toLowerCase()) )
      if (check) el.checked = true
      else el.checked = false
    }
    else {
      await locator.fill(value)
    }
  }

  /**
    * Scrolls the mouse wheel in a specified direction by a given number of pixels
    * @example scroll("down", 100) => Scrolls down 100 pixels
    * @example scroll("up", 50) => Scrolls up 50 pixels
    * @example scroll("left", 200) => Scrolls left 200 pixels
    * @example scroll("right") => Scrolls right using default 100 pixels
    *
    * @param direction The direction to scroll: "up", "down", "left", or "right"
    * @param px The number of pixels to scroll (defaults to 100)
    * @returns Promise<void>
    */
  async scroll(locator:Locator, direction:"up"|"down"|"left"|"right", px = 100) {
    let horiz = direction.includes('t')
    let el = await locator.element()
    if (horiz) await el.scrollBy(direction === 'right' ? px : -px, 0)
    else await el.scrollBy(0, direction === 'down' ? px : -px)
  }

  /**
    * A helper function for parsing text on a page or in an element.
    * Can be used to check for the presence OR absence of visible OR hidden text.
    * Examples:
    * @example expectText(locator, 'text', true, true) // expect that a locator with the text is visible (and there may be hidden ones)
    * @example expectText(locator, 'text', false, true) // expect that NO locator with the text is visible (but there may be hidden ones)
    * @example expectText(locator, 'text', true, false) // expect that a HIDDEN locator with the text IS FOUND on the page (but there may be visible ones)
    * @example expectText(locator, 'text', false, false) // expect that NO hidden locator with the text is found on the page (but there may be visible ones)
    *
    * @param locator the locator to check
    * @param text the text to be found
    * @param toBePresent whether a locator with the text should be present
    * @param toBeVisible whether the locator with the text should be visible
    * @returns void
    */
  async expectText(locator:Locator|BrowserPage, text:string, toBePresent:boolean=true, toBeVisible:boolean=true) {
    try {
      await this.expectElement(locator.getByText(text), toBePresent, toBeVisible)
    }
    catch(e) {
      let message = `The${toBeVisible ? '' : ' hidden'} text "${text}" was unexpectedly ${toBePresent ? 'not present' : 'present'}.`
      throw new Error(message)
    }
  }

  /**
    * A helper function for parsing elements on a page or in an element.
    * Can be used to check for the presence OR absence of visible OR hidden elements.
    * Examples:
    * @example expectElement(locator, true) // expect that an element is visible (and there may be hidden ones)
    * @example expectElement(locator, false) // expect that NO element is visible (but there may be hidden ones)
    * @example expectElement(locator, true, false) // expect that a HIDDEN element IS FOUND on the page (but there may be visible ones)
    * @example expectElement(locator, false, false) // expect that NO hidden element is found on the page (but there may be visible ones)
    *
    * @param locator the locator to check
    * @param toBePresent whether an element should be present
    * @param toBeVisible whether the element should be visible
    */
  async expectElement(locator:Locator, toBePresent:boolean=true, toBeVisible:boolean=true) {
    let allElements = await locator.elements()
    let matchingElements = allElements.filter(el => toBeVisible === el.checkVisibility({ opacityProperty:true, visibilityProperty:true }))
    if (toBePresent === (matchingElements.length === 0)) throw new Error(`The${toBeVisible ? '' : ' hidden'} element "${locator}" was unexpectedly ${toBePresent ? 'not present' : 'present'}.`)
  }

  /**
   * Waits for a certain amount of time
   * @param ms number
   */
  async waitForTimeout(ms:number) {
    await new Promise(r => setTimeout(r, ms))
  }

  /**
   * Helper function to cache a component from the steps file.
   *
   * @param filepath string The path to the component file
   * @param group string|undefined the group in which the component should appear
   * @param controls DataTable|undefined the controls for the component, in the following format:
   * ```
   * | prop   | type                                                        | values                  |
   * | string | string, number, boolean, checkboxes, select, radios, object | string, comma-separated |
   * ```
   */
  cacheComponent(filepath:string, group?:string|undefined, controls?:DataTable, keys:string[] = ['prop','type','values']) {
    let variants:ComponentVariant[] = []
    filepath = this.sanitizeFilepath(`${this.componentDir}/${filepath}`)
    let name =  filepath.replace(/.+\//, '').replace(/\.[^\.]*$/, '')
    if (controls) {
      let _ = controls.raw()
      if (_.length) {
        if (_[0][0] === keys[0] && _[0][1] === keys[1]) _.shift();
        variants = _.map(row => {
          let prop = row[0]
          let type = row[1].toLowerCase()
          if (!isVariantType(type)) throw new Error(`Invalid variant type: ${row[1]} (${variantTypes.join(', ')})`)
          let values = row[2].split(/\s*,\s*/).map(v => {
            if (v.match(/^\d+$/)) return Number(v)
            else if (v.match(/^"\d+"$/)) return v.replace(/"/g,"")
            else return v
          })
          return { prop, type, values }
        })
      }
    }
    this.common.componentsCache.set(name, {
      filepath,
      name,
      group,
      testpath:this.context.task.file.filepath,
      variants,
    })
  }

}

function isCheckboxOrRadio(el:any):el is HTMLInputElement {
  return el.type === 'checkbox' || el.type === 'radio'
}

Before(async (world:VitestBrowserWorld) => {
  await world.cleanup()
})