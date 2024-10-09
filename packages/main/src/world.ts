import type { TestContext } from 'vitest'
export interface QuickPickleWorldInterface {
  info: {
    feature: string,
    scenario: string,
    tags: string[],
    rule?: string,
    step?: string,
    line?: number,
  }
  context: TestContext,
  common: {
    [key: string]: any
  }
  init: () => Promise<void>
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