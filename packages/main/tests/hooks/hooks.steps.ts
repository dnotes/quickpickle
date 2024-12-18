import { expect } from 'vitest';
import { Given, When, Then, BeforeAll, Before, BeforeStep, AfterStep, After, AfterAll, QuickPickleWorld } from 'quickpickle';

const log:any = {}

BeforeAll(async (common) => {
  console.log('beforeAll')
  common.beforeAll = 'beforeAll'
  common.totalSteps = 0
  log.tests = {}
})

BeforeAll('@taggedBeforeAll', async (state) => {
  console.log('taggedBeforeAll')
  state.taggedBeforeAll = 'taggedBeforeAll'
})

Before(async (state) => {
  state.common.before = true
  log.tests[state.info.scenario] = []
  log.tests[state.info.scenario].push('Before')
  state.hooks = {}
  state.hooks.beforeHook = true
})

BeforeStep(async (state) => {
  log.tests[state.info.scenario].push('BeforeStep')
})

AfterStep({ name:'Clear errors', tags: '@clearErrorsAfterStep' }, async (state) => {
  state.info.errors = []
})

AfterStep(async (state) => {
  state.common.totalSteps++
  log.tests[state.info.scenario].push('errors: ' + state.info.errors.length)
  log.tests[state.info.scenario].push('AfterStep')
})

After(async (state) => {
  log.tests[state.info.scenario].push('errors: ' + state.info.errors.length)
  log.tests[state.info.scenario].push('After')
})

const testWithNoErrors = [
  'Before',
  'BeforeStep',
  'errors: 0',
  'AfterStep',
  'BeforeStep',
  'errors: 0',
  'AfterStep',
  'errors: 0',
  'After',
]

const testWithError = [
  'Before',
  'BeforeStep',
  'errors: 0',
  'AfterStep',
  'BeforeStep',
  'errors: 1',
  'AfterStep',
  'errors: 1',
  'After',
]

AfterAll("not @taggedBeforeAll", async (common) => {
  console.log('AfterAll')
  await expect(common.beforeAll).toBe('beforeAll')
  await expect(common.before).toBe(true)
  await expect(common.totalSteps).not.toBeFalsy()
  await expect(log.tests).toMatchObject({
    'Hooks: All hooks should work': testWithNoErrors,
    'Hooks: Hooks also work on @soft tests': testWithNoErrors,
    'Hooks: Errors are available in the hook': testWithError,
    'Hooks: The AfterStep hook can clear errors': testWithNoErrors,
    'Hooks: AfterStep must be @soft when clearing errors, or the test still fails': testWithNoErrors,
    'Hooks: If the errors are not cleared, a @soft test still fails': testWithError,
  })
})