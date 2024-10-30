import { addStepDefinition, findStepDefinitionMatch } from './steps';
import { get, defaultsDeep } from 'lodash-es';
import { Plugin, ResolvedConfig as ViteResolvedConfig } from 'vite'
import {
  BeforeAll, applyBeforeAllHooks,
  Before, applyBeforeHooks,
  AfterAll, applyAfterAllHooks,
  After, applyAfterHooks,
  BeforeStep, applyBeforeStepHooks,
  AfterStep, applyAfterStepHooks,
} from './hooks';
import { explodeTags, tagsMatch, renderGherkin } from './render';
import { DataTable } from '@cucumber/cucumber';
import { DocString } from './models/DocString';

export { setWorldConstructor, getWorldConstructor, QuickPickleWorld, QuickPickleWorldInterface } from './world';
export { DocString, DataTable }
export { explodeTags, tagsMatch }

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

export const gherkinStep = async (step: string, state: any, line: number, stepIdx:number, explodeIdx?:number, data?:any): Promise<any> => {
  const stepDefinitionMatch: StepDefinitionMatch = findStepDefinitionMatch(step);

  // Set the state info
  state.info.step = step
  state.info.line = line
  state.info.stepIdx = stepIdx
  state.info.explodedIdx = explodeIdx

  // Sort out the DataTable or DocString
  if (Array.isArray(data)) {
    data = new DataTable(data)
  }
  else if (data?.hasOwnProperty('content')) {
    data = new DocString(data.content, data.mediaType)
  }

  try {
    applyBeforeStepHooks(state);
    try {
      await stepDefinitionMatch.stepDefinition.f(state, ...stepDefinitionMatch.parameters, data);
    }
    catch(e:any) {
      let stack = e.stack.split('\n')
      while(!stack[0].match('gherkinStep')) stack.shift()
      stack.shift()
      stack[0] = stack[0].replace(/:\d+:\d+$/, `:${state.info.line}:1`)
      e.stack = stack.join('\n')
      throw e
    }
    applyAfterStepHooks(state);
  }
  catch(e:any) {
    e.message = `${step} (#${line})\n${e.message}`
    if (state.tagsMatch(state.config.softFailTags)) {
      state.info.errors.push(e)
      if (!state.isComplete) return
    }
    throw e
  }
  finally {
    if (state.info.errors.length && state.isComplete) {
      let error = state.info.errors[state.info.errors.length-1]
      error.message = `Scenario finished with ${state.info.errors.length} errors:\n\n${state.info.errors.map((e:any) => e?.message || '(no error message)').reverse().join('\n\n')}`
      throw error
    }
  }
};

export type QuickPickleConfigSetting<T = {[key:string]:any}> = Partial<{
  todoTags: string|string[]
  skipTags: string|string[]
  failTags: string|string[]
  softFailTags: string|string[]
  concurrentTags: string|string[]
  sequentialTags: string|string[]
  explodeTags: string|string[]|string[][]
  worldConfig: Partial<T>
}>;

export type QuickPickleConfig<T = {[key:string]:any}> = {
  todoTags: string[]
  skipTags: string[]
  failTags: string[]
  softFailTags: string[]
  concurrentTags: string[]
  sequentialTags: string[]
  explodeTags: string[][]
  worldConfig: Partial<T>
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
   * Tags to mark as soft failing, allowing further steps to run until the end of the scenario.
   */
  softFailTags: ['@soft', '@softfail'],

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

export const quickpickle = (conf:Partial<QuickPickleConfigSetting> = {}):Plugin => {
  let config:QuickPickleConfig
  let passedConfig:QuickPickleConfigSetting = {...conf}

  return {
    name: 'quickpickle-transform',
    configResolved(resolvedConfig: ResolvedConfig) {
      config = defaultsDeep(
        get(resolvedConfig, 'test.quickpickle') || {},
        get(resolvedConfig, 'quickpickle') || {},
        passedConfig,
        defaultConfig,
      );
      config.todoTags = normalizeTags(config.todoTags)
      config.skipTags = normalizeTags(config.skipTags)
      config.failTags = normalizeTags(config.failTags)
      config.softFailTags = normalizeTags(config.softFailTags)
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
