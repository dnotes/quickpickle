import type { TestContext } from 'vitest'
import { tagsMatch } from './tags'
import type { QuickPickleConfig } from '.'
import sanitize from './shims/path-sanitizer'
import pixelmatch, { type PixelmatchOptions } from 'pixelmatch';
import type { AriaRole } from '@a11y-tools/aria-roles';
import { ariaRoles } from '@a11y-tools/aria-roles';
import { defineParameterType } from './steps'
export type AriaRoleExtended = AriaRole|'element'|'input'
import { Buffer } from 'buffer'
import { getPNG } from './shims/png.js'
import { defaultsDeep } from 'lodash-es';

interface Common {
  info: {
    feature: string
    tags: string[]
  }
  [key:string]: any
}

export interface QuickPickleWorldInterface {
  info: {
    config: QuickPickleConfig   // the configuration for QuickPickle
    feature: string             // the Feature name (not file name)
    scenario: string            // the Scenario name
    tags: string[]              // the tags for the Scenario, including tags for the Feature and/or Rule
    steps: string[]             // an array of all Steps in the current Scenario
    stepIdx?: number            // the index of the current Step, starting from 1 (not 0)
    rule?: string               // the Rule name, if any
    step?: string               // the current Step
    line?: number               // the line number, in the file, of the current Step
    explodedIdx?: number        // the index of the test case, if exploded, starting from 1 (not 0)
    errors: any[]               // an array of errors that have occurred, if the Scenario is tagged for soft failure
  }
  context: TestContext,         // the Vitest context
  isComplete: boolean           // (read only) whether the Scenario is on the last step
  config: QuickPickleConfig                       // (read only) configuration for QuickPickle
  worldConfig: QuickPickleConfig['worldConfig']   // (read only) configuration for the World
  data: {[key:string]:any}      // Data limited to the current Scenario
  common: Common                // Common data shared across ALL tests in one Feature file --- USE SPARINGLY
  init: () => Promise<void>                 // function called by QuickPickle when the world is created
  tagsMatch(tags: string[]): string[]|null  // function to check if the Scenario tags match the given tags
  sanitizePath:typeof sanitize              // function to sanitize a path string, from npm package "path-sanitizer" (shims)
  fullPath(path:string):string              // function to ensure that a filepath is valid and a subdirectory of the project root
  wait(ms:number):Promise<void>             // function to wait for a given time

}

export type InfoConstructor = Omit<QuickPickleWorldInterface['info'], 'errors'> & { common:Common }
export class QuickPickleWorld implements QuickPickleWorldInterface {
  private _projectRoot: string = ''
  info: QuickPickleWorldInterface['info']
  common: QuickPickleWorldInterface['common']
  context: TestContext
  data = {}
  sanitizePath = sanitize
  constructor(context:TestContext, info:InfoConstructor) {
    this.context = context
    this.common = info.common
    this.info = { ...info, errors:[] }
    this._projectRoot = info.config.root
  }
  async init() {}
  get config() { return this.info.config }
  get worldConfig() { return this.info.config.worldConfig }
  get isComplete() { return this.info.stepIdx === this.info.steps.length }
  get projectRoot() { return this._projectRoot }
  /**
   * Checks the tags of the Scenario against a provided list of tags,
   * and returns the shared tags, with the "@" prefix character.
   *
   * @param tags tags to check
   * @returns string[]|null
   */
  tagsMatch(tags: string[]) {
    return tagsMatch(tags, this.info.tags)
  }
  /**
   * Given a provided path-like string, returns a full path that:
   *
   * 1. contains no invalid characters.
   * 2. is a subdirectory of the project root.
   *
   * This is intended for security when retrieving and saving files;
   * it does not slugify filenames or check for a file's existence.
   *
   * @param path string the path to sanitize
   * @return string the sanitized path, including the project root
   */
  fullPath(path: string):string {
    return `${this._projectRoot}/${this.sanitizePath(path)}`
  }

  /**
   * A helper function for when you really just need to wait.
   *
   * @deprecated Waiting for arbitrary amounts of time makes your tests flaky! There are
   * usually better ways to wait for something to happen, and this functionality will be
   * removed from the API as soon we're sure nobody will **EVER** want to use it again.
   * (That may be a long time.)
   *
   * @param ms milliseconds to wait
   */
  async wait(ms:number) {
    await new Promise(r => setTimeout(r, ms))
  }

  toString() {
    let parts = [
      this.constructor.name,
      this.info.feature,
      this.info.scenario + (this.info.explodedIdx ? ` (${this.info.tags.join(',')})` : ''),
      `${this.info.stepIdx?.toString().padStart(2,'0')} ${this.info.step}`,
    ]
    return parts.join('_')
  }
}

export type WorldConstructor = new (
  context: TestContext,
  info: InfoConstructor,
) => QuickPickleWorldInterface;

let worldConstructor:WorldConstructor = QuickPickleWorld

export function getWorldConstructor() {
  return worldConstructor
}

export function setWorldConstructor(constructor: WorldConstructor) {
  worldConstructor = constructor
}

export type VisualDiffResult = {
  diff: Buffer,
  pixels: number,
  pct: number,
}

export type ScreenshotComparisonOptions = any & Partial<PixelmatchOptions> & {
  maxDiffPercentage?: number
  maxDiffPixels?: number
}

export const defaultScreenshotComparisonOptions:ScreenshotComparisonOptions = {
  maxDiffPercentage: 0,
  threshold: 0.1,
  alpha: 0.6
}

export interface VisualConfigSetting {
  screenshotDir?: string,
  screenshotOpts?: Partial<ScreenshotComparisonOptions>
}

interface StubVisualWorldInterface extends QuickPickleWorldInterface {

  /**
   * The directory where screenshots are saved, relative to the project root.
   */
  screenshotDir:string

  /**
   * The filename for a screenshot based on the current Scenario.
   */
  screenshotFilename:string

  /**
   * The full path to a screenshot file, from the root of the file system,
   * based on the current Scenario.
   */
  screenshotPath:string

  /**
   * The options for the default screenshot comparisons.
   */
  screenshotOptions:Partial<ScreenshotComparisonOptions>

  /**
   * The full path to a screenshot file, from the root of the file system,
   * based on the custom name provided, and including information on any
   * exploded tags as necessary.
   *
   * @param name
   */
  getScreenshotPath(name?:string):string

  /**
   * A helper function to compare two screenshots, for visual regression testing.
   * If the screenshots do not match, the difference should be returned as a Buffer.
   */
  screenshotDiff(actual:Buffer, expected:Buffer, options?:any):Promise<VisualDiffResult>

}

export interface VisualWorldInterface extends StubVisualWorldInterface {

  /**
   * A helper method for getting an element, which should work across different testing libraries.
   * The "Locator" interface used should be whatever is compatible with the testing library
   * being integrated by your World Constructor. This is intended as an 80% solution for
   * behavioral tests, so that a single step definition can get an element based on a variety
   * of factors, e.g. (in Playwright syntax):
   *
   * @example getLocator(page, 'Cancel', 'button') => page.getByRole('button', { name: 'Cancel' })
   * @example getLocator(page, 'Search', 'input') => page.getByLabel('Search').or(page.getByPlaceholder('Search'))
   * @example getLocator(page, 'ul.fourteen-points li', 'element', 'Open covenants of peace') => page.locator('ul.fourteen-points li').filter({ hasText: 'Open covenants of peace' })
   *
   * @param locator Locator
   * The container inside which to search for the required element.
   * @param identifier string
   * A string that identifies the element to be found. For ARIA roles this is the "name" attribute,
   * for role="input" it is the label or placeholder, and for role="element" it is the CSS selector.
   * @param role string
   * An ARIA role, or "input" to get an input by label or placeholder, or "element" to get an element by css selector.
   * @param text string
   * A string that the element must contain.
   */
  getLocator(locator:any, identifier:string, role:AriaRoleExtended, text?:string|null):any

  /**
   * Sets a value on a form element based on its type (select, checkbox/radio, or other input).
   * The "Locator" interface used should be whatever is compatible with the testing library
   * being integrated by your World Constructor. This is intended as an 80% solution for
   * behavioral tests, so that a single step definition can get an element based on a variety
   * of factors, e.g.:
   *
   * @example setValue(<SelectInput>, "Option 1, Option 2") => Selects multiple options in a select element
   * @example setValue(<RadioInput>, "true") => Checks a checkbox/radio item
   * @example setValue(<CheckboxInput>, "false") => Unchecks a checkbox item
   * @example setValue(<TextInput>, "Some text") => Fills a text input with "Some text"
   * @example setValue(<NumberInput>, 5) => Sets a number input to the number 5
   *
   * @param locator Locator
   * The Locator for the form element
   * @param value string|any
   * The value to set can be string or other value type
   */
  setValue(locator:any, value:string|any):Promise<void>

  /**
   * Scrolls an element by a number of pixels in a given direction.
   *
   * @param locator Locator
   * The locator that should be scrolled
   * @param direction "up"|"down"|"left"|"right"
   * The direction to scroll, i.e. "up", "down", "left", "right"
   * @param px
   * A number of pixels to scroll
   */
  scroll(locator:any, direction:string, px:number):Promise<void>

  /**
   * A helper method for parsing text on a page or in an element.
   * Can be used to check for the presence OR absence of visible OR hidden text.
   *
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
  expectText(locator:any, text:string, toBePresent:boolean, toBeVisible:boolean):Promise<void>;

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
  expectElement(locator:any, toBePresent:boolean, toBeVisible:boolean):Promise<void>;

  /**
   * A helper function to get a screenshot of the current page or an element.
   * Depending on the implementation, it may also save a screenshot to disk.
   */
  screenshot(opts?:{name?:string,locator?:any}):Promise<Buffer>

  /**
   * A helper function to test whether two screenshots match. The "Locator" interface used
   * should be whatever is compatible with the testing library being integrated by your World Constructor.
   *
   * @param locator the locator to check
   * @param screenshotName the name of the screenshot to compare against
   */
  expectScreenshotMatch(locator:any, screenshotName:string, options?:any):Promise<void>

  screenshotOptions:Partial<ScreenshotComparisonOptions>

}


export class VisualWorld extends QuickPickleWorld implements StubVisualWorldInterface {

  constructor(context:TestContext, info:InfoConstructor) {
    super(context,info)
  }

  async init() {}

  get screenshotDir() {
    return this.sanitizePath(this.worldConfig.screenshotDir)
  }

  get screenshotFilename() {
    return `${this.toString().replace(/^.+?Feature: /, 'Feature: ').replace(' ' + this.info.step, '')}.png`
  }

  get screenshotPath() {
    return this.fullPath(`${this.screenshotDir}/${this.screenshotFilename}`)
  }

  get screenshotOptions() {
    return defaultsDeep((this.worldConfig.screenshotOptions || {}), (this.worldConfig.screenshotOpts || {}), defaultScreenshotComparisonOptions)
  }

  getScreenshotPath(name?:string) {
    if (!name) return this.screenshotPath

    // If name is already a full absolute path (starts with project root), return as-is
    if (name.startsWith(this.projectRoot)) {
      return name
    }

    // If name starts with the screenshot directory, remove it
    else if (name.startsWith(this.screenshotDir)) name = name.slice(this.screenshotDir.length)

    // If name already ends with .png, remove it
    const hasExtension = name.endsWith('.png')
    const baseName = hasExtension ? name.slice(0, -4) : name

    // Add the exploded tags if necessary
    let explodedTags = this.info.explodedIdx ? `_(${this.info.tags.join(',')})` : ''
    if (name.includes(explodedTags)) explodedTags = ''

    // Return the full path
    return this.fullPath(`${this.screenshotDir}/${baseName}${explodedTags}.png`)
  }

  async screenshotDiff(actual:Buffer, expected:Buffer, opts:any): Promise<VisualDiffResult> {

    // Get the PNG constructor using the shim
    const PNG = await getPNG()

    // Parse PNG images to get raw pixel data
    const actualPng = PNG.sync.read(actual)
    const expectedPng = PNG.sync.read(expected)
    const { width, height } = expectedPng

    const diffPng = new PNG({ width, height })

    try {
      const pixels = pixelmatch(
        actualPng.data,
        expectedPng.data,
        diffPng.data,
        width,
        height,
        opts
      )
      const pct = (pixels / (width * height)) * 100
      return { diff:PNG.sync.write(diffPng), pixels, pct }
    }
    catch(e:any) {
      e.message += `\n  expected: w:${width}px h:${height}px ${expectedPng.data.length}b\n    actual: w:${actualPng.width}px h:${actualPng.height}px ${actualPng.data.length}b`
      throw e
    }
  }

}

defineParameterType({
  name: 'AriaRole',
  regexp: new RegExp(`(${([ 'element', 'input', ...Object.keys(ariaRoles)]).join('|')})`),
})