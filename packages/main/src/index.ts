import { addStepDefinition, findStepDefinitionMatch } from './steps';
import { get, defaultsDeep } from 'lodash-es';
import { Plugin, ResolvedConfig as ViteResolvedConfig } from 'vite'
import {
  BeforeAll,
  Before,
  AfterAll,
  After,
  BeforeStep,
  AfterStep,
  applyHooks,
} from './hooks';
import { explodeTags, renderGherkin } from './render';
import { DataTable } from '@cucumber/cucumber';
import { DocString } from './models/DocString';
import { normalizeTags, tagsMatch } from './tags';

export { setWorldConstructor, getWorldConstructor, QuickPickleWorld, QuickPickleWorldInterface } from './world';
export { DocString, DataTable }
export { explodeTags, tagsMatch, normalizeTags, applyHooks }
export { defineParameterType } from './steps'

const featureRegex = /\.feature(?:\.md)?$/;

export { BeforeAll, Before, AfterAll, After, BeforeStep, AfterStep };

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

export function formatStack(text:string, line:string) {
  let stack = text.split('\n')
  while(!stack[0].match(/\.feature(?:\.md)?:\d+:\d+/)) stack.shift()
  stack[0] = stack[0].replace(/:\d+:\d+$/, `:${line}:1`)
  return stack.join('\n')
}

export const gherkinStep = async (stepType:"Context"|"Action"|"Outcome", step: string, state: any, line: number, stepIdx:number, explodeIdx?:number, data?:any): Promise<any> => {

  try {
    // Set the state info
    state.info.stepType = stepType
    state.info.step = step
    state.info.line = line
    state.info.stepIdx = stepIdx
    state.info.explodedIdx = explodeIdx

    // Sort out the DataTable or DocString
    let dataType = ''
    if (Array.isArray(data)) {
      data = new DataTable(data)
      dataType = 'dataTable'
    }
    else if (data?.hasOwnProperty('content')) {
      data = new DocString(data.content, data.mediaType)
      dataType = 'docString'
    }

    await applyHooks('beforeStep', state);

    try {
      const stepDefinitionMatch: StepDefinitionMatch = findStepDefinitionMatch(step, { stepType, dataType });
      await stepDefinitionMatch.stepDefinition.f(state, ...stepDefinitionMatch.parameters, data);
    }
    catch(e:any) {
      // Add the Cucumber info to the error message
      e.message = `${step} (#${line})\n${e.message}`

      // Sort out the stack for the Feature file
      e.stack = formatStack(e.stack, state.info.line)

      // Set the flag that this error has been added to the state
      e.isStepError = true

      // Add the error to the state
      state.info.errors.push(e)

      // If not in a soft fail mode, re-throw the error
      if (state.isComplete || !state.tagsMatch(state.config.softFailTags)) throw e
    }
    finally {
      await applyHooks('afterStep', state);
    }
  }
  catch(e:any) {

    // If the error hasn't already been added to the state:
    if (!e.isStepError) {

      // Add the Cucumber info to the error message
      e.message = `${step} (#${line})\n${e.message}`

      // Add the error to the state
      state.info.errors.push(e)
    }

    // If in soft fail mode and the state is not complete, don't throw the error
    if (state.tagsMatch(state.config.softFailTags) && (!state.isComplete || !state.info.errors.length)) return

    // The After hook is usually run in the rendered file, at the end of the rendered steps.
    // But, if the tests have failed, then it should run here, since the test is halted.
    await applyHooks('after', state)

    // Otherwise throw the error
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
  root?:string
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
  root: string
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
   * The root directory for the tests to run, from vite or vitest config
   */
  root: '',

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

function is2d(arr:string|string[]|string[][]):arr is string[][] {
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
      if (is2d(config.explodeTags)) config.explodeTags = config.explodeTags.map(normalizeTags)
      else config.explodeTags = [normalizeTags(config.explodeTags)]
      if (!config.root) config.root = resolvedConfig.root
    },
    async transform(src: string, id: string) {
      if (featureRegex.test(id)) {
        return renderGherkin(src, config, id.match(/\.md$/) ? true : false)
      }
    },
  };
}

export default quickpickle;
