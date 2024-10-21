import type { TestContext } from 'vitest'
import { tagsMatch } from './render'
export interface QuickPickleWorldInterface {
  info: {
    feature: string,
    scenario: string,
    tags: string[],
    rule?: string,
    step?: string,
    line?: number,
    explodedIdx?: number,
    stepIdx?: number,
  }
  context: TestContext,
  common: {
    [key: string]: any
  }
  init: () => Promise<void>
  tagsMatch(tags: string[]): string[]|null
}

export class QuickPickleWorld implements QuickPickleWorldInterface {
  info: QuickPickleWorldInterface['info'] = {
    feature: '',
    scenario: '',
    tags: [],
  }
  common: QuickPickleWorldInterface['common'] = {}
  context: TestContext
  constructor(context:TestContext, info?:QuickPickleWorldInterface['info']) {
    this.context = context
    if (info) this.info = {...info}
  }
  async init() {}
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
  info?: QuickPickleWorldInterface['info'],
  worldConfig?: any
) => QuickPickleWorldInterface;

let worldConstructor:WorldConstructor = QuickPickleWorld

export function getWorldConstructor() {
  return worldConstructor
}

export function setWorldConstructor(constructor: WorldConstructor) {
  worldConstructor = constructor
}