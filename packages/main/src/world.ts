import type { TestContext } from 'vitest'
import { tagsMatch } from './tags'
import type { QuickPickleConfig } from '.'

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
  projectRoot: string           // (read only) the project root directory
  init: () => Promise<void>                       // function called by QuickPickle when the world is created
  tagsMatch(tags: string[]): string[]|null        // function to check if the Scenario tags match the given tags
}

export type InfoConstructor = Omit<QuickPickleWorldInterface['info'], 'errors'> & { common:Common }

export class QuickPickleWorld implements QuickPickleWorldInterface {
  private _projectRoot: string = ''
  info: QuickPickleWorldInterface['info']
  common: QuickPickleWorldInterface['common']
  context: TestContext
  data = {}
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
  tagsMatch(tags: string[]) {
    return tagsMatch(tags, this.info.tags)
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