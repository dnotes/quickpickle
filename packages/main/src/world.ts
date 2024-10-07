export interface QuickPickleWorldInterface {
  info: {
    feature: string,
    scenario: string,
    tags: string[],
    rule?: string,
    step?: string,
    line?: number,
  }
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
    rule: '',
    step: '',
  }
  common: QuickPickleWorldInterface['common'] = {}
  async init() {}
}

let worldConstructor = QuickPickleWorld

export function getWorldConstructor() {
  return worldConstructor
}

export function setWorldConstructor(constructor: new () => QuickPickleWorldInterface) {
  worldConstructor = constructor
}