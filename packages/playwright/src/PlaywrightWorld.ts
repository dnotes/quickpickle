import { chromium, firefox, webkit, type Browser, type BrowserContext, type Page } from 'playwright';
import { normalizeTags, QuickPickleWorld, QuickPickleWorldInterface } from 'quickpickle';
import { After } from 'quickpickle';
import type { TestContext } from 'vitest';
import { defaultsDeep } from 'lodash-es'
import { InfoConstructor } from 'quickpickle/dist/world';

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
  keyboardDelay: number // the number of milliseconds between key presses (default:20)
  defaultBrowser: 'chromium'|'firefox'|'webkit' // the default browser to use (default: chromium)
  browserSizes: Record<string,string> // the default browser sizes to use, in the form "widthxheight"
  // (default: { mobile: "480x640", tablet: "1024x768", desktop: "1920x1080", widescreen: "3440x1440" })
  defaultBrowserSize: string // the default browser size to use (default: desktop)
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
  defaultBrowser: 'chromium',
  browserSizes: {
    mobile: '480x640',
    tablet: '1024x768',
    desktop: '1920x1080',
    widescreen: '3440x1440',
  },
  defaultBrowserSize: 'desktop',
}

export type PlaywrightWorldConfig = typeof defaultPlaywrightWorldConfig & {
  port?:number,
  browserSizes: Record<string,string>
}

export class PlaywrightWorld extends QuickPickleWorld {
  browser!: Browser
  browserContext!: BrowserContext
  page!: Page

  constructor(context:TestContext, info:InfoConstructor) {
    super(context, info)
    this.setConfig(info.config.worldConfig)
  }

  async init() {
    await this.startBrowser()
    this.browserContext = await this.browser.newContext({
      serviceWorkers: 'block',
      javaScriptEnabled: this.tagsMatch(this.worldConfig.nojsTags) ? false : true,
    })
    this.page = await this.browserContext.newPage()
    await this.setViewportSize()
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
    let newConfig = defaultsDeep(worldConfig || {}, defaultPlaywrightWorldConfig )
    newConfig.nojsTags = normalizeTags(newConfig.nojsTags)
    newConfig.showBrowserTags = normalizeTags(newConfig.showBrowserTags)
    newConfig.slowMoTags = normalizeTags(newConfig.slowMoTags)
    if (!['chromium','firefox','webkit'].includes(newConfig.defaultBrowser)) newConfig.defaultBrowser = 'chromium'
    if (typeof newConfig.slowMo === 'number') {
      newConfig.slowMoMs = newConfig.slowMo
      newConfig.slowMo = newConfig.slowMoMs > 0
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
    if (this.worldConfig.port) return new URL(`${this.worldConfig.host}:${this.worldConfig.port}`)
    else return new URL(this.worldConfig.host)
  }

  get playwrightConfig() {
    console.warn('playwrightConfig is deprecated. Use worldConfig instead.')
    return this.worldConfig
  }

}

function getDimensions(size:string) {
  let [width,height] = size.split('x').map(Number)
  return {width,height}
}

After(async (world:PlaywrightWorld) => {
  await world.browserContext.close()
})
