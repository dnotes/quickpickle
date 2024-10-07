import { AfterAll, Before, BeforeStep, IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import { PlaywrightWorld } from './PlaywrightWorld.js';

let browser: Browser;
let context: BrowserContext;
let page: Page;

browser = await(chromium.launch())
context = await browser.newContext({
  serviceWorkers: 'block'
})
page = await context.newPage()

let webWorld = new PlaywrightWorld(browser, context, page)

setWorldConstructor(webWorld)

BeforeStep(async function (step) {

  this.step = step.pickleStep.text

})

Before(async function (scenario) {

  this.browser = browser
  this.context = context
  this.page = page

  this.scenario = scenario.pickle.name
  this.tags = scenario.pickle.tags.map(t => t.name)

});

AfterAll(async function () {
  await browser.close()
})