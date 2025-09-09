import { isFunction, isString, isObject, concat, sortBy } from 'lodash-es'
import { tagsFunction } from './tags';

type HookFunction = (state: any) => Promise<void>

interface Hook {
  name: string
  f: HookFunction
  tags: string
  tagsFunction: (tags:string[]) => boolean
  weight: number
}

interface HookCollection {
  [key: string]: Hook[];
}

const allHooks: HookCollection = {
  beforeAll: [],
  before: [],
  beforeStep: [],
  afterAll: [],
  after: [],
  afterStep: [],
};

const hookNames: { [key: string]: string } = {
  beforeAll: 'BeforeAll',
  before: 'Before',
  beforeStep: 'BeforeStep',
  afterAll: 'AfterAll',
  after: 'After',
  afterStep: 'AfterStep',
};

export const applyHooks = async (hooksName: string, state: any): Promise<void> => {
  const hooks = sortBy(allHooks[hooksName], 'weight');
  for (let i = 0; i < hooks.length; i++) {
    let hook = hooks[i]
    const result = hook.tagsFunction(state.info.tags.map((t:string) => t.toLowerCase()));
    if (result) {
      await hook.f(state)
    }
  }
  return state;
};

const addHook = (hooksName: string, p1: string | Partial<Hook> & { f: HookFunction } | HookFunction, p2?: string | string[] | HookFunction): void => {

  let hook:Hook = { name:'', f:async ()=>{}, tags:'', tagsFunction: () => true, weight: 0 }

  if (isFunction(p1)) hook = { ...hook, f: p1}
  else if (isString(p1)) hook.tags = p1
  else hook = { ...hook, ...p1 }

  if (isFunction(p2)) hook.f = p2

  if (!hook.f) throw new Error('Function required: ' + JSON.stringify({ p1, p2 }))

  hook.tagsFunction = tagsFunction(hook.tags.toLowerCase())

  allHooks[hooksName] = concat(allHooks[hooksName], hook);
};

type AddHookFunction = (p1: string | Partial<Hook> & { f: HookFunction } | HookFunction, p2?: HookFunction) => void

export const BeforeAll:AddHookFunction = (p1,p2): void => { addHook('beforeAll', p1, p2) };

export const Before:AddHookFunction = (p1,p2): void => { addHook('before', p1, p2) };

export const BeforeStep:AddHookFunction = (p1,p2): void => { addHook('beforeStep', p1, p2) };

export const AfterAll:AddHookFunction = (p1,p2): void => { addHook('afterAll', p1, p2) };

export const After:AddHookFunction = (p1,p2): void => { addHook('after', p1, p2) };

export const AfterStep:AddHookFunction = (p1,p2): void => { addHook('afterStep', p1, p2) };
