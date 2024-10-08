import { addStepDefinition, findStepDefinitionMatch } from './steps';
import { get, defaults } from 'lodash-es';
import { Plugin, ResolvedConfig as ViteResolvedConfig } from 'vite'
import {
  BeforeAll, applyBeforeAllHooks,
  Before, applyBeforeHooks,
  AfterAll, applyAfterAllHooks,
  After, applyAfterHooks,
  BeforeStep, applyBeforeStepHooks,
  AfterStep, applyAfterStepHooks,
} from './hooks';
import { renderGherkin } from './render';
import { DataTable } from '@cucumber/cucumber';
import { DocString } from './models/DocString';

export { setWorldConstructor, getWorldConstructor, QuickPickleWorld, QuickPickleWorldInterface } from './world';
export { DocString, DataTable }

const featureRegex = /\.feature(?:\.md)?$/;

export { BeforeAll, Before, AfterAll, After, BeforeStep, AfterStep };

export {
  applyBeforeAllHooks,
  applyBeforeHooks,
  applyAfterAllHooks,
  applyAfterHooks,
  applyBeforeStepHooks,
  applyAfterStepHooks,
};

export const Given = addStepDefinition;
export const When = addStepDefinition;
export const Then = addStepDefinition;

interface Step {
  text: string;
  dataTable?: any;
  docString?: {
    text: string;
  };
  type: {
    type: 'given' | 'when' | 'then';
    name: string;
  };
}

interface StepDefinitionMatch {
  stepDefinition: {
    f: (state: any, ...args: any[]) => any;
  };
  parameters: any[];
}

export const qp = async (step: string, state: any, line: number, data?: any): Promise<any> => {
  const stepDefinitionMatch: StepDefinitionMatch = findStepDefinitionMatch(step);

  // Set the state info
  state.info.step = step
  state.info.line = line

  // Sort out the DataTable or DocString
  if (Array.isArray(data)) {
    data = new DataTable(data)
  }
  else if (data?.hasOwnProperty('content')) {
    data = new DocString(data.content, data.mediaType)
  }

  try {
    applyBeforeStepHooks(state);
    await stepDefinitionMatch.stepDefinition.f(state, ...stepDefinitionMatch.parameters, data);
    applyAfterStepHooks(state);
  }
  catch(e:any) {
    e.message = `${step} (#${line})\n${e.message}`
    throw e
  }
};

export type QuickPickleConfig<T = {[key:string]:any}> = {
  todoTags: string|string[]
  skipTags: string|string[]
  failTags: string|string[]
  concurrentTags: string|string[]
  sequentialTags: string|string[]
  explodeTags: string|string[]|string[][]
  worldConfig: T
};

export const defaultConfig: QuickPickleConfig = {

  /**
   * Tags to mark as todo, using Vitest's `test.todo` implementation.
   */
  todoTags: ['@todo','@wip'],

  /**
   * Tags to skip, using Vitest's `test.skip` implementation.
   */
  skipTags: ['@skip'],

  /**
   * Tags to mark as failing, using Vitest's `test.failing` implementation.
   */
  failTags: ['@fails', '@failing'],

  /**
   * Tags to run in parallel, using Vitest's `test.concurrent` implementation.
   */
  concurrentTags: ['@concurrent'],

  /**
   * Tags to run sequentially, using Vitest's `test.sequential` implementation.
   */
  sequentialTags: ['@sequential'],

  /**
   * Explode tags into multiple tests, e.g. for different browsers.
   */
  explodeTags: [],

  /**
   * The config for the World class. Must be serializable with JSON.stringify.
   * Not used by the default World class, but may be used by plugins or custom
   * implementations, like @quickpickle/playwright.
   */
  worldConfig: {}

}

interface ResolvedConfig extends ViteResolvedConfig {
  quickpickle?: Partial<QuickPickleConfig>;
}

export function normalizeTags(tags?:string|string[]|undefined):string[] {
  if (!tags) return []
  tags = Array.isArray(tags) ? tags : tags.split(/\s*,\s*/g)
  return tags.filter(Boolean).map(tag => tag.startsWith('@') ? tag : `@${tag}`)
}

function is3d(arr:string|string[]|string[][]):arr is string[][] {
  return Array.isArray(arr) && arr.every(item => Array.isArray(item))
}

function explodeArray(arr: string[][]): string[][] {
  if (arr.length === 0) return [[]];

  const [first, ...rest] = arr;
  const subCombinations = explodeArray(rest);

  return first.flatMap(item =>
    subCombinations.map(subCombo => [item, ...subCombo])
  );
}

export function explodeTags(explodeTags:string[][], testTags:string[]):string[][] {
  if (!explodeTags.length) return [testTags]
  let tagsToTest = [...testTags]

  // gather a 3d array of items that are shared between tags and each array in explodeTags
  // and then remove those items from the tags array
  const sharedTags = explodeTags.map(tagList => {
    let items = tagList.filter(tag => tagsToTest.includes(tag))
    if (items.length) items.forEach(item => tagsToTest.splice(tagsToTest.indexOf(item), 1))
    return items
  })

  // then, build a 3d array of all possible combinations of the remaining tags
  let combined = explodeArray(sharedTags)

  // finally, return the list
  return combined.length ? combined.map(arr => [...tagsToTest, ...arr]) : [testTags]
}

export const quickpickle = (conf:Partial<QuickPickleConfig> = {}):Plugin => {
  let config:QuickPickleConfig
  let passedConfig = {...conf}

  return {
    name: 'quickpickle-transform',
    configResolved(resolvedConfig: ResolvedConfig) {
      config = Object.assign(
        {},
        defaultConfig,
        passedConfig,
        get(resolvedConfig, 'quickpickle') || {},
        get(resolvedConfig, 'test.quickpickle') || {},
      ) as QuickPickleConfig;
      config.todoTags = normalizeTags(config.todoTags)
      config.skipTags = normalizeTags(config.skipTags)
      config.failTags = normalizeTags(config.failTags)
      config.concurrentTags = normalizeTags(config.concurrentTags)
      config.sequentialTags = normalizeTags(config.sequentialTags)
      if (is3d(config.explodeTags)) config.explodeTags = config.explodeTags.map(normalizeTags)
      else config.explodeTags = [normalizeTags(config.explodeTags)]
    },
    async transform(src: string, id: string) {
      if (featureRegex.test(id)) {
        return renderGherkin(src, config, id.match(/\.md$/) ? true : false)
      }
    },
  };
}

export default quickpickle;
