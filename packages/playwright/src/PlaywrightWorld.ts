import { chromium, firefox, webkit, type Browser, type BrowserContext, type Page } from 'playwright';
import { normalizeTags, QuickPickleWorld, QuickPickleWorldInterface } from 'quickpickle';
import { After } from 'quickpickle';
import type { TestContext } from 'vitest';
import { defaultsDeep } from 'lodash-es'

const browsers = { chromium, firefox, webkit }

export type PlaywrightWorldConfigSetting = Partial<{
  host: string, // default host, including protocol (default: http://localhost)
  port: number, // port to which the browser should connect (default: undefined)
  screenshotDir: string, // directory in which to save screenshots (default: "screenshots")
  nojsTags: string|string[] // tags for scenarios to run without javascript (default: @nojs, @noscript)
  showBrowserTags: string|string[] // tags for scenarios to run with browser visible (default: @browser, @show-browser, @showbrowser)
  slowMoTags: string|string[] // tags for scenarios to be run with slow motion enabled (default: @slowmo)
  headless: boolean // whether to run the browser in headless mode (default true)
  slowMo: boolean|number // whether to run the browser with slow motion enabled (default false)
  slowMoMs: number // the number of milliseconds to slow down the browser by (default 500)
  keyboardDelay: number // the number of milliseconds between key presses
  defaultBrowser: 'chromium'|'firefox'|'webkit' // the default browser to use
}>

export const defaultPlaywrightWorldConfig = {
  host: 'http://localhost',
  screenshotDir: 'screenshots',
  nojsTags: ['@nojs', '@noscript'],
  showBrowserTags: ['@browser','@show-browser','@showbrowser'],
  slowMoTags: ['@slowmo'],
  headless: true,
  slowMo: false,
  slowMoMs: 500,
  keyboardDelay: 20,
  defaultBrowser: 'chromium'
}

export type PlaywrightWorldConfig = typeof defaultPlaywrightWorldConfig & { port?:number }

export class PlaywrightWorld extends QuickPickleWorld {
  browser!: Browser
  browserContext!: BrowserContext
  page!: Page
  playwrightConfig:PlaywrightWorldConfig = defaultPlaywrightWorldConfig

  constructor(context:TestContext, info:QuickPickleWorldInterface['info']|undefined, worldConfig:PlaywrightWorldConfigSetting = {}) {
    super(context, info)
    this.setConfig(worldConfig)
  }

  async init() {
    await this.startBrowser()
    this.browserContext = await this.browser.newContext({
      serviceWorkers: 'block',
      javaScriptEnabled: this.tagsMatch(this.playwrightConfig.nojsTags) ? false : true,
    })
    this.page = await this.browserContext.newPage()
  }

  get browserName() {
    return this.info.tags.find(t => t.match(
      /^@(?:chromium|firefox|webkit)$/
    ))?.replace(/^@/, '') as 'chromium'|'firefox'|'webkit' ?? this.playwrightConfig.defaultBrowser ?? 'chromium'
  }

  setConfig(worldConfig:PlaywrightWorldConfigSetting) {
    let newConfig = defaultsDeep(worldConfig || {}, defaultPlaywrightWorldConfig )
    newConfig.nojsTags = normalizeTags(newConfig.nojsTags)
    newConfig.showBrowserTags = normalizeTags(newConfig.showBrowserTags)
    newConfig.slowMoTags = normalizeTags(newConfig.slowMoTags)
    if (!['chromium','firefox','webkit'].includes(newConfig.defaultBrowser)) newConfig.defaultBrowser = 'chromium'
    if (typeof newConfig.slowMo === 'number') {
      newConfig.slowMoMs = newConfig.slowMo
      newConfig.slowMo = newConfig.slowMoMs > 0
    }
    this.playwrightConfig = newConfig
  }

  async startBrowser() {
    this.browser = await browsers[this.browserName].launch({
      headless: this.tagsMatch(this.playwrightConfig.showBrowserTags) ? false : this.playwrightConfig.headless,
      slowMo: (this.playwrightConfig.slowMo || this.tagsMatch(this.playwrightConfig.slowMoTags)) ? this.playwrightConfig.slowMoMs : 0
    })
  }

  async reset(conf?:PlaywrightWorldConfigSetting) {
    await this.page?.close()
    await this.browserContext?.close()
    if (conf) {
      await this.browser.close()
      await this.setConfig(conf)
      await this.startBrowser()
    }
    this.browserContext = await this.browser.newContext({
      serviceWorkers: 'block'
    })
    this.page = await this.browserContext.newPage()
  }

  async close() {
    await this.browser.close()
  }

  get baseUrl() {
    if (this.playwrightConfig.port) return new URL(`${this.playwrightConfig.host}:${this.playwrightConfig.port}`)
    else return new URL(this.playwrightConfig.host)
  }
}

After(async (world:PlaywrightWorld) => {
  await world.browserContext.close()
})
