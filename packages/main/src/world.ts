import type { TestContext } from 'vitest'
import { tagsMatch } from './tags'
import type { QuickPickleConfig } from '.'
import sanitize from './shims/path-sanitizer'

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