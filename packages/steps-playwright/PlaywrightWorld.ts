import { World } from '@cucumber/cucumber';
import { type Browser, type BrowserContext, type Page } from 'playwright';

export interface PlaywrightWorldInterface {
  browser: Browser;
  context: BrowserContext;
  page: Page;

  scenario:string;
  step:string;
  tags:string[];

  screenshots:string;

  data:{[key:string]:any}

}

export class PlaywrightWorld extends World implements PlaywrightWorldInterface {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  scenario = ''
  step = ''
  tags = []
  screenshots = './screenshots'
  data = {}

  constructor(browser:Browser, context:BrowserContext, page:Page, options:any = {}) {
    super(options)
    this.browser = browser
    this.context = context
    this.page = page
  }

  async reset() {
    await this.page?.close()
    await this.context?.close()
    this.context = await this.browser.newContext({
      serviceWorkers: 'block'
    })
    this.page = await this.context.newPage()
  }
}
