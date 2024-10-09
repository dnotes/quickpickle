import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import { normalizeTags, QuickPickleWorld, QuickPickleWorldInterface } from 'quickpickle';
import { After } from 'quickpickle';
import type { TestContext } from 'vitest';
import { defaults, intersection } from 'lodash-es'

export type PlaywrightWorldConfigSetting = {
  nojsTags?: string|string[]
  headless: boolean
  sloMo: number
}

export const defaultPlaywrightWorldConfig = {
  nojsTags: ['@nojs', '@noscript'],
  headless: true,
  slowMo: 0,
}

export type PlaywrightWorldConfig = typeof defaultPlaywrightWorldConfig

export class PlaywrightWorld extends QuickPickleWorld {
  browser!: Browser
  browserContext!: BrowserContext
  page!: Page
  playwrightConfig:PlaywrightWorldConfig = defaultPlaywrightWorldConfig

  constructor(context:TestContext, info:QuickPickleWorldInterface['info']|undefined, worldConfig?:PlaywrightWorldConfigSetting) {
    super(context, info)
    let newConfig = defaults(defaultPlaywrightWorldConfig, worldConfig || {})
    newConfig.nojsTags = normalizeTags(newConfig.nojsTags)
    this.playwrightConfig = newConfig
  }

  async init() {
    this.browser = await chromium.launch()
    this.browserContext = await this.browser.newContext({
      serviceWorkers: 'block',
      javaScriptEnabled: intersection(this.info.tags, this.playwrightConfig.nojsTags)?.length ? false : true,
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
}

After(async (world:PlaywrightWorld) => {
  await world.browserContext.close()
})
