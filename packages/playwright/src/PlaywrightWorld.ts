import { chromium, firefox, Locator, webkit, type Browser, type BrowserContext, type Page } from 'playwright';
import { normalizeTags, VisualWorld, VisualWorldInterface, ScreenshotComparisonOptions, AriaRoleExtended, isAriaRoleExtended } from 'quickpickle';
import { After } from 'quickpickle';
import type { TestContext } from 'vitest';
import { cloneDeep, defaultsDeep } from 'lodash-es'
import { InfoConstructor, VisualDiffResult } from 'quickpickle/dist/world';
import { Buffer } from 'buffer';
import { promises as fs } from 'node:fs';

import { expect } from '@playwright/test';
import { ScreenshotSetting } from './snapshotMatcher';

const browsers = { chromium, firefox, webkit }

export type PlaywrightWorldConfigSetting = Partial<{
  /**
   * The host to connect to.
   * @default http://localhost
   */
  host: string,
  /**
   * The port to connect to.
   * @default undefined
   */
  port: number,
  /**
   * The directory in which to save screenshots.
   * @default "screenshots"
   */
  screenshotDir: string,
  /**
   * Options for the default screenshot comparisons.
   * @default undefined
   */
  screenshotOptions?: ScreenshotSetting,
  /**
   * Tags for scenarios to run without javascript.
   * @default ["@nojs","@noscript"]
   */
  nojsTags: string|string[],
  /**
   * Tags for scenarios to run with browser visible.
   * @default ["@browser","@show-browser","@showbrowser"]
   */
  showBrowserTags: string|string[] // tags for scenarios to run with browser visible (default: @browser, @show-browser, @showbrowser)
  /**
   * Tags for scenarios to be run with slow motion enabled.
   * @default ["@slowmo"]
   */
  slowMoTags: string|string[],
  /**
   * Whether to run the browser in headless mode.
   * @default true
   */
  headless: boolean,
  /**
   * Whether to run the browser with slow motion enabled.
   * @default false
   */
  slowMo: boolean|number // whether to run the browser with slow motion enabled (default false)
  /**
   * The number of milliseconds to slow down the browser by.
   * @default 500
   */
  slowMoMs: number,
  /**
   * The number of milliseconds between key presses.
   * @default 20
   */
  keyboardDelay: number,
  /**
   * The default browser to use.
   * @default "chromium"
   */
  defaultBrowser: 'chromium'|'firefox'|'webkit' // the default browser to use (default: chromium)
  /**
   * The default browser sizes to use, in the form "widthxheight".
   * @default {mobile:"480x640",tablet:"1024x768",desktop:"1920x1080",widescreen:"3440x1440"}
   */
  browserSizes: Record<string,string>,
  /**
   * The default browser size to use.
   * @default "desktop"
   */
  defaultBrowserSize: string,
  /**
   * @deprecated alias for defaultTimeout.
   */
  stepTimeout: number,
  /**
   * The default timeout in milliseconds for all methods that accept a timeout option.
   * This should always be lower than the QuickPickle stepTimeout, or After functions may fail to run.
   * @default 1000
   */
  defaultTimeout: number,
  /**
   * The default timeout in milliseconds for actions like click, fill, etc.
   * If 0 or not set, uses defaultTimeout.
   */
  actionTimeout: number,
  /**
   * The default timeout in milliseconds for navigation actions like goto, reload, etc.
   * If 0 or not set, uses defaultTimeout.
   * @default 3000
   */
  navigationTimeout: number,
}>

export const defaultPlaywrightWorldConfig = {
  host: 'http://localhost',
  screenshotDir: 'screenshots',
  nojsTags: ['@nojs', '@noscript'],
  showBrowserTags: ['@browser','@show-browser','@showbrowser'],
  slowMoTags: ['@slowmo'],
  headless: true,
  slowMo: false,
  slowMoMs: 100,
  keyboardDelay: 20,
  defaultBrowser: 'chromium',
  browserSizes: {
    mobile: '480x640',
    tablet: '1024x768',
    desktop: '1920x1080',
    widescreen: '3440x1440',
  },
  defaultBrowserSize: 'mobile',
  defaultTimeout: 1000,
  navigationTimeout: 3000,
}

export type PlaywrightWorldConfig = typeof defaultPlaywrightWorldConfig & {
  port?:number,
  browserSizes: Record<string,string>
}

export type BrowserMap = {
  context: BrowserContext
  page: Page
}
export class PlaywrightWorld extends VisualWorld implements VisualWorldInterface {
  browser!: Browser

  identities: Map<string, BrowserMap> = new Map()
  _identity:string = 'default'

  constructor(context:TestContext, info:InfoConstructor) {
    super(context, info)
    this.setConfig(info.config.worldConfig)
    // Handle deprecated stepTimeout and timeout
    if (info.config.worldConfig.stepTimeout && !info.config.worldConfig.defaultTimeout) {
      info.config.worldConfig.defaultTimeout = info.config.worldConfig.stepTimeout
    }
  }

  async init() {
    await super.init()
    await this.startBrowser()
    await this.newIdentity('default')
    await this.setViewportSize()
  }
  get browserContext() {
    return this.identities.get(this.identity)!.context
  }
  get page() {
    return this.identities.get(this.identity)!.page
  }
  get identity() {
    return this._identity
  }
  set identity(name:string) {
    if (this.identities.has(name)) this._identity = name
    else throw new Error(`There is no browser for "${name}"; please call \`await world.setIdentity('${name}')\` instead.`)
  }
  async newIdentity(name:string) {
    let context = await this.browser.newContext({
      serviceWorkers: 'block',
      javaScriptEnabled: this.tagsMatch(this.worldConfig.nojsTags) ? false : true,
    })
    // Set default timeouts on the context
    context.setDefaultTimeout(this.worldConfig.actionTimeout || this.worldConfig.defaultTimeout)
    context.setDefaultNavigationTimeout(this.worldConfig.navigationTimeout || this.worldConfig.defaultTimeout)
    
    let page = await context.newPage()
    
    if (name !== 'default') {
      let url = this.identities.get('default')!.page.url()
      await page.goto(url)
    }
    this.identities.set(name, {
      context,
      page
    })
  }
  async setIdentity(name:string) {
    if (!this.identities.has(name)) await this.newIdentity(name)
    this._identity = name
  }

  get browserName() {
    return this.info.tags.find(t => t.match(
      /^@(?:chromium|firefox|webkit)$/
    ))?.replace(/^@/, '') as 'chromium'|'firefox'|'webkit' ?? this.worldConfig.defaultBrowser ?? 'chromium'
  }

  get browserSize() {
    let tag = this.tagsMatch(this.browserSizeTags)?.[0]?.replace(/^@/, '')
    let sizeStr = (tag
      ? this.worldConfig.browserSizes[tag.replace(/^@/,'')]
      : this.worldConfig.browserSizes[this.worldConfig.defaultBrowserSize]
    ) ?? '1920x1080'
    return getDimensions(sizeStr)
  }

  get browserSizeTags() {
    return Object.keys(this.worldConfig.browserSizes).map(k => `@${k}`)
  }

  setConfig(worldConfig:PlaywrightWorldConfigSetting) {
    let newConfig = defaultsDeep(worldConfig || {}, defaultPlaywrightWorldConfig)
    newConfig.nojsTags = normalizeTags(newConfig.nojsTags)
    newConfig.showBrowserTags = normalizeTags(newConfig.showBrowserTags)
    newConfig.slowMoTags = normalizeTags(newConfig.slowMoTags)
    if (!['chromium','firefox','webkit'].includes(newConfig.defaultBrowser)) newConfig.defaultBrowser = 'chromium'
    if (typeof newConfig.slowMo === 'number') {
      newConfig.slowMoMs = newConfig.slowMo
      newConfig.slowMo = newConfig.slowMoMs > 0
    }
    // Migrate deprecated timeout properties to defaultTimeout
    if (newConfig.stepTimeout && !newConfig.defaultTimeout) {
      newConfig.defaultTimeout = newConfig.stepTimeout
    }
    this.info.config.worldConfig = newConfig
  }
  async setViewportSize(size?:string) {
    if (size) {
      size = size.replace(/^['"]/, '').replace(/['"]$/, '')
      if (this.worldConfig.browserSizes[size]) {
        await this.page.setViewportSize(getDimensions(this.worldConfig.browserSizes[size]))
      }
      else if (size.match(/^\d+x\d+$/)) {
        await this.page.setViewportSize(getDimensions(size))
      }
      else throw new Error(`Invalid browser size: ${size}
        (found: ${this.worldConfig.browserSizes[size]})
        (available: ${Object.keys(this.worldConfig.browserSizes).join(', ')})`)
    }
    else await this.page.setViewportSize(this.browserSize)
  }

  async startBrowser() {
    this.browser = await browsers[this.browserName].launch({
      headless: this.tagsMatch(this.worldConfig.showBrowserTags) ? false : this.worldConfig.headless,
      slowMo: (this.worldConfig.slowMo || this.tagsMatch(this.worldConfig.slowMoTags)) ? this.worldConfig.slowMoMs : 0
    })
  }

  async reset(conf?:PlaywrightWorldConfigSetting) {
    let url = this.page.url() || this.baseUrl.toString()
    for (let identity of this.identities.keys()) {
      await this.identities.get(identity)!.context.close()
    }
    await this.browser.close()
    if (conf) await this.setConfig(conf)
    await this.startBrowser()
    this.identities = new Map()
    await this.newIdentity('default')
    this.identity = 'default'
    await this.page.goto(url)
  }

  async close() {
    await this.browser.close()
  }

  get baseUrl() {
    if (this.worldConfig.port) return new URL(`${this.worldConfig.host}:${this.worldConfig.port}`)
    else return new URL(this.worldConfig.host)
  }

  get playwrightConfig() {
    console.warn('playwrightConfig is deprecated. Use worldConfig instead.')
    return this.worldConfig
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
  getLocator(el:Locator|Page, identifier:string, role:AriaRoleExtended|string, text:string|null=null) {
    let locator:Locator
    if (!isAriaRoleExtended(role)) throw new Error(`Invalid ARIA role: ${role}`)
    if (role === 'element') locator = el.locator(identifier)
    else if (role === 'input') locator = el.getByLabel(identifier).or(el.getByPlaceholder(identifier))
    else locator = el.getByRole(role, { name: identifier })
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
    let { tag, type, role } = await locator.evaluate((el) => ({ tag:el.tagName.toLowerCase(), type:el.getAttribute('type')?.toLowerCase(), role:el.getAttribute('role')?.toLowerCase() }), undefined, { timeout: this.worldConfig.actionTimeout || this.worldConfig.defaultTimeout })
    if (!tag) throw new Error(`Could not find element with locator: ${locator.toString()}`)
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
  async scroll(locator:Locator|Page, direction:"up"|"down"|"left"|"right", px = 100) {
    let horiz = direction.includes('t')
    if (horiz) await this.page.mouse.wheel(direction === 'right' ? px : -px, 0)
    else await this.page.mouse.wheel(0, direction === 'down' ? px : -px)
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
  async expectText(locator:Locator|Page, text:string, toBePresent:boolean=true, toBeVisible:boolean=true) {
    try {
      await this.expectElement(locator.getByText(text), toBePresent, toBeVisible)
    }
    catch(e) {
      throw new Error(`The${toBeVisible ? '' : ' hidden'} text "${text}" was unexpectedly ${toBePresent ? 'not present' : 'present'}.`)
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
  async expectElement(locator:Locator|Page, toBePresent:boolean=true, toBeVisible:boolean=true) {
    let visibleText = toBeVisible ? 'true' : ''
    try {
      if (toBePresent) await expect(locator.locator(`visible=${visibleText}`).first()).toBeAttached()
      else await expect(locator.locator(`visible=${visibleText}`)).toHaveCount(0)
    }
    catch(e) {
      throw new Error(`The${toBeVisible ? '' : ' hidden'} element "${locator}" was unexpectedly ${toBePresent ? 'not present' : 'present'}.`)
    }
  }

  /**
    * A helper function for getting a metatag from a page.
    * @example expectMetatag(page, 'title', 'Example') // expect that the page title CONTAINS "Example"
    * @example expectMetatag(page, 'title', 'Example', true) // expect that the page title EQUALS "Example"
    * @example expectMetatag(page, 'title', 'Example', true, false) // expect that the page title DOES NOT EQUAL "Example"
    * @example expectMetatag(page, 'title', 'Example', false, false) // expect that the page title DOES NOT CONTAIN "Example"
    *
    * @param page The playwright page to check
    * @param name The name of the metatag to check
    * @param expected The expected string to check
    * @param exact Whether the expected string should be an exact match
    * @param expectMatching Whether the expected string should match or NOT match
    */
  async expectMetatag(page:Page, name:string, expected:string, exact:boolean, expectMatching = true) {
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

  get screenshotOptions() {
    let opts = cloneDeep(defaultsDeep(this.worldConfig.screenshotOptions || {}, this.worldConfig.screenshotOpts || {}))
    if (opts.mask) opts.mask = opts.mask.map((m:string) => this.page.locator(m))
    return opts
  }

  async screenshot(opts?:{name?:string,locator?:any}):Promise<Buffer> {
    let explodedTags = this.info.explodedIdx ? `_(${this.info.tags.join(',')})` : ''
    let path = opts?.name ? this.fullPath(`${this.screenshotDir}/${opts.name}${explodedTags}.png`) : this.screenshotPath
    let locator = opts?.locator ?? this.page
    return await locator.screenshot({ path, ...this.screenshotOptions })
  }

  async expectScreenshotMatch(locator:Locator|Page, screenshotNameOrPath:string, options?:Partial<ScreenshotComparisonOptions>):Promise<void> {
    const opts = defaultsDeep(options || {}, this.screenshotOptions)
    let path = this.getScreenshotPath(screenshotNameOrPath)

    // Get the expected image (or save a new one if none exists)
    let expected:Buffer
    try {
      expected = await fs.readFile(path)
    }
    catch(e:any) {
      await locator.screenshot({ path, ...opts })
      throw new Error(`Visual regression test: ${e.message}`)
    }

    // Get the actual image
    let actual:Buffer
    actual = await locator.screenshot({ ...opts })

    // Compare the images using the inherited screenshotDiff method
    let matchResult:VisualDiffResult
    try {
      matchResult = await this.screenshotDiff(actual, expected, opts)
    }
    catch(e) {
      await fs.writeFile(`${path}.actual.png`, actual)
      throw e
    }

    // Check if the screenshots match within tolerance
    const maxDiffPercentage = opts.maxDiffPercentage || 0
    const maxDiffPixels = opts.maxDiffPixels || 0

    if (matchResult.pct <= maxDiffPercentage || matchResult.pixels <= maxDiffPixels) {
      // Screenshots match, clean up any previous failure files
      try {
        await fs.unlink(`${path}.actual.png`)
      } catch(e){}
      try {
        await fs.unlink(`${path}.diff.png`)
      } catch(e){}
      return
    }

    // Screenshots don't match, save diff and actual files
    try {
      await fs.writeFile(`${path}.actual.png`, actual)
      await fs.writeFile(`${path}.diff.png`, matchResult.diff)
    } catch(e){}

    throw new Error([`Images were too different: ${path}`,
      `Diff percentage: ${matchResult.pct.toFixed(2)}% (max ${maxDiffPercentage}%)`,
      `Pixels: ${matchResult.pixels} (max ${maxDiffPixels})`,
      `Diff paths: ${path}.{actual,diff}.png`,
    ].join('\n'))
  }

}

function getDimensions(size:string) {
  let [width,height] = size.split('x').map(Number)
  return {width,height}
}

After({
  f: async (world:PlaywrightWorld) => {
    for (let identity of world.identities.keys()) {
      await world.identities.get(identity)!.context.close()
    }
    await world.browser.close()
  },
  weight: 99,
})