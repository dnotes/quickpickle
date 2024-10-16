import { chromium, firefox, webkit, type Browser, type BrowserContext, type Page } from 'playwright';
import { normalizeTags, QuickPickleWorld, QuickPickleWorldInterface } from 'quickpickle';
import { After } from 'quickpickle';
import type { TestContext } from 'vitest';
import { defaultsDeep } from 'lodash-es'

const browsers = { chromium, firefox, webkit }

export type PlaywrightWorldConfigSetting = Partial<{
  host: string,
  port: number,
  screenshotDir: string,
  nojsTags: string|string[]
  showBrowserTags: string|string[]
  slowMoTags: string|string[]
  headless: boolean
  slowMo: boolean|number
  slowMoMs: number
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
}

export type PlaywrightWorldConfig = typeof defaultPlaywrightWorldConfig & { port?:number }

export class PlaywrightWorld extends QuickPickleWorld {
  browser!: Browser
  browserContext!: BrowserContext
  page!: Page
  playwrightConfig:PlaywrightWorldConfig = defaultPlaywrightWorldConfig

  constructor(context:TestContext, info:QuickPickleWorldInterface['info']|undefined, worldConfig:PlaywrightWorldConfigSetting = {}) {
    super(context, info)
    let newConfig = defaultsDeep(worldConfig || {}, defaultPlaywrightWorldConfig, )
    newConfig.nojsTags = normalizeTags(newConfig.nojsTags)
    newConfig.showBrowserTags = normalizeTags(newConfig.showBrowserTags)
    newConfig.slowMoTags = normalizeTags(newConfig.slowMoTags)
    if (typeof newConfig.slowMo === 'number') {
      newConfig.slowMoMs = newConfig.slowMo
      newConfig.slowMo = newConfig.slowMoMs > 0
    }
    this.playwrightConfig = newConfig
  }

  async init() {
    let browserName = this.info.tags.find(t => t.match(
      /^@(?:chromium|firefox|webkit)$/
    ))?.replace(/^@/, '') as 'chromium'|'firefox'|'webkit' ?? 'chromium'
    this.browser = await browsers[browserName].launch({
      headless: this.tagsMatch(this.playwrightConfig.showBrowserTags) ? false : this.playwrightConfig.headless,
      slowMo: (this.playwrightConfig.slowMo || this.tagsMatch(this.playwrightConfig.slowMoTags)) ? this.playwrightConfig.slowMoMs : 0
    })
    this.browserContext = await this.browser.newContext({
      serviceWorkers: 'block',
      javaScriptEnabled: this.tagsMatch(this.playwrightConfig.nojsTags) ? false : true,
    })
    this.page = await this.browserContext.newPage()
  }

  async reset() {
    await this.page?.close()
    await this.browserContext?.close()
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
