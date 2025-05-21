import { Before, QuickPickleWorld, QuickPickleWorldInterface } from 'quickpickle';
import type { BrowserPage, Locator, UserEvent, ScreenshotOptions } from '@vitest/browser/context'
import { defaultsDeep } from 'lodash-es'
import type { TestContext } from 'vitest';
import { ScreenshotComparisonOptions, VisualConfigSetting, VisualWorld, VisualWorldInterface, type InfoConstructor } from 'quickpickle';
import { commands } from '@vitest/browser/context';
import { Buffer } from 'buffer'


/// <reference types="@vitest/browser/providers/playwright" />

export interface VitestWorldConfigSetting extends VisualConfigSetting {
  componentDir?:        string;
}

export const defaultVitestWorldConfig:VitestWorldConfigSetting = {
  componentDir: '',               // directory in which components are kept, relative to project root
  screenshotDir: 'screenshots',   // directory in which to save screenshots, relative to project root (default: "screenshots")
  screenshotOpts: {               // options for the default screenshot comparisons
    threshold: 0.1,
    alpha: 0.6,
    maxDiffPercentage: .01,
  },
}

export type ActionsInterface = {
  clicks: any[];
  doubleClicks: any[];
}

export interface VitestBrowserWorldInterface extends VisualWorldInterface {
  /**
   * The `render` function must be provided by the World Constructor
   * and must be tailored for the framework being used. It should render
   * the component, and then use the parent element to set the `page` property
   * of the World.
   *
   * @param name string|any The compoenent to render
   * @param props any The properties to use when rendering the component
   * @param renderOptions any Options to pass to the render function
   * @returns Promise<void>
   */
  render: (name:string|any, props?:any, renderOptions?:any)=>Promise<void>;
  /**
   * The `cleanup` function must be provided by the World Constructor
   * and must be tailored for the framework being used.
   *
   * @returns void
   */
  cleanup: ()=>Promise<void>;
  actions: ActionsInterface
  browserPage: BrowserPage;
  page: Locator;
  userEvent: UserEvent;
}

export class VitestBrowserWorld extends VisualWorld implements VitestBrowserWorldInterface {

  actions:ActionsInterface = {
    clicks: [],
    doubleClicks: [],
  };
  browserPage!: BrowserPage;
  userEvent!: UserEvent;
  async render(name:string|any,props?:any,renderOptions?:any){};
  async cleanup(){};
  _page!:Locator|null;

  constructor(context:TestContext, info:InfoConstructor) {
    info = defaultsDeep(info || {}, { config: { worldConfig: defaultVitestWorldConfig } } )
    super(context, info);
    if (!info.config.worldConfig.screenshotDir && info.config.worldConfig?.screenshotOptions?.customSnapshotsDir) {
      this.info.config.worldConfig.screenshotDir = info.config.worldConfig.screenshotOptions.customSnapshotsDir
    }
  }

  async init() {
    let browserContext = await import('@vitest/browser/context')
    this.browserPage = browserContext.page;
    this.userEvent = browserContext.userEvent;
  }

  get page():Locator {
    if (!this._page) throw new Error('You must render a component before running tests.')
    return this._page
  }

  set page(value:HTMLElement) {
    while (value.parentNode !== null && value.nodeName !== 'BODY') value = value.parentNode as HTMLBodyElement
    this._page = this.browserPage.elementLocator(value)
    value.addEventListener('click', (e)=>{
      this.actions.clicks.push(e.target)
    })
    value.addEventListener('dblclick', (e)=>{
      this.actions.doubleClicks.push(e.target)
    })
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
    if (el.nodeName === 'BODY' && el.parentElement) el = el.parentElement
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

  async screenshot(opts?:{
    bufferOnly?:boolean
    name?:string
    locator?:Locator
  }):Promise<any> {
    let path
    if (!opts?.bufferOnly) path = this.getScreenshotPath(opts?.name)
    let locator = opts?.locator ?? this.page
    return locator.screenshot({ path })
  }

  async expectScreenshotMatch(locator:Locator, filename?:string, opts:ScreenshotComparisonOptions={}) {

    const filepath = this.getScreenshotPath(filename)
    let expectedImg:string

    /**
     * Load existing screenshot, or save it if it doesn't yet exist
     */
    try {
      expectedImg = await commands.readFile(this.getScreenshotPath(filename), 'base64')
    }
    catch(e) {
      // If the screenshot doesn't exist, save it and pass the test
      await locator.screenshot()
      console.warn(`new visual regression test: ${this.screenshotDir}/${this.screenshotFilename}`)
      return
    }

    let expected = Buffer.from(expectedImg, 'base64')

    /**
     * Get the screenshot
     */
    // type does not include the "save" option in the docs: see https://vitest.dev/guide/browser/locators#screenshot
    let screenshotOptions = { save:false, base64:true } as ScreenshotOptions
    let actualImg = await locator.screenshot(screenshotOptions) as string|{ base64:string }
    let actual = Buffer.from(typeof actualImg === 'string' ? actualImg : actualImg.base64, 'base64')

    /**
     * Compare the two screenshots
     */
    let screenshotOpts = defaultsDeep(opts, this.worldConfig.screenshotOpts)
    let matchResult = null
    try {
      matchResult = await this.screenshotDiff(actual, expected, screenshotOpts)
    }
    catch(e) {}
    console.log({
      pass: matchResult?.pass,
      diffPercentage: matchResult?.diffPercentage,
      filename,
      locator,
    }.toString())

    if (!matchResult?.pass) {
      await commands.writeFile(`${filepath}.actual.png`, actual.toString('base64'), 'base64');
      if (matchResult?.diff) await commands.writeFile(`${filepath}.diff.png`, matchResult.diff.toString('base64'), 'base64');
      throw new Error(`Screenshot does not match the snapshot.
  Diff percentage: ${matchResult?.diffPercentage?.toFixed(2) ?? '100'}%
  Max allowed: ${screenshotOpts.maxDiffPercentage}%
  Diffs at: ${filepath}.(diff|actual).png`)
    }
  }

  /**
   * Waits for a certain amount of time
   * @param ms number
   * @deprecated use `wait` method instead
   */
  async waitForTimeout(ms:number) {
    await new Promise(r => setTimeout(r, ms))
  }

}

function isCheckboxOrRadio(el:any):el is HTMLInputElement {
  return el.type === 'checkbox' || el.type === 'radio'
}

Before(async (world:VitestBrowserWorld) => {
  await world.cleanup()
})