import { isFunction, isString, isObject, concat } from 'lodash-es'
import { normalizeTags } from './tags';

interface Hook {
  name: string;
  f: (state: any) => Promise<any> | any;
  tags?: string|string[];
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

const applyHooks = async (hooksName: string, state: any): Promise<any> => {
  const hooks = allHooks[hooksName];
  for (let i = 0; i < hooks.length; i++) {
    let hook = hooks[i]
    if (!hook?.tags?.length || state?.tagsMatch(hook.tags)) {
      await hook.f(state)
    }
  }
  return state;
};

const addHook = (hooksName: string, opts: string | Hook | ((state:any) => any), f?: (state:any) => any): void => {
  let hookOpts: Hook;

  if (isFunction(opts)) {
    hookOpts = { name: '', f: opts };
  } else if (isString(opts)) {
    hookOpts = { name: opts, f: f! };
  } else if (isObject(opts)) {
    hookOpts = opts as Hook
    hookOpts.f = hookOpts.f || f!
    hookOpts.tags = normalizeTags(hookOpts.tags)
  } else {
    throw new Error('Unknown options argument: ' + JSON.stringify(opts));
  }

  allHooks[hooksName] = concat(allHooks[hooksName], hookOpts);
};


export const BeforeAll = (opts: string | (() => any), f?: () => any): void => { addHook('beforeAll', opts, f) };
export const applyBeforeAllHooks = (state: any): Promise<any> => applyHooks('beforeAll', state);

export const Before = (opts: string | Hook | ((state:any) => any), f?: (state:any) => any): void => { addHook('before', opts, f) };
export const applyBeforeHooks = (state: any): Promise<any> => applyHooks('before', state);

export const BeforeStep = (opts: string | Hook | ((state:any) => any), f?: (state:any) => any): void => { addHook('beforeStep', opts, f) };
export const applyBeforeStepHooks = (state: any): Promise<any> => applyHooks('beforeStep', state);

export const AfterAll = (opts: string | (() => any), f?: () => any): void => { addHook('afterAll', opts, f) };
export const applyAfterAllHooks = (state: any): Promise<any> => applyHooks('afterAll', state);

export const After = (opts: string | Hook | ((state:any) => any), f?: (state:any) => any): void => { addHook('after', opts, f) };
export const applyAfterHooks = (state: any): Promise<any> => applyHooks('after', state);

export const AfterStep = (opts: string | Hook | ((state:any) => any), f?: (state:any) => any): void => { addHook('afterStep', opts, f) };
export const applyAfterStepHooks = (state: any): Promise<any> => applyHooks('afterStep', state);
