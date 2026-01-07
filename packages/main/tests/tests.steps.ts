import { expect } from "vitest";
import { Given, Then, When, defaultConfig, defineParameterType } from "../src";
import type { DataTable } from "../src";
import { clone, get, set, escapeRegExp } from "lodash-es";
import type { DocString } from "../src/models/DocString";
import { renderGherkin } from "../src/render";

defineParameterType({
  name: 'updown',
  regexp: /(up|down)/,
})

Given("I run the tests", () => {});

Then("the tests (should )pass", () => {
  expect(true).to.be.true;
})

Then("the tests (should )fail", () => {
  expect(true).to.be.false;
})

Given('(I have )a number {int}', (world, int) => {
  if (!world.numbers) world.numbers = [int]
  else world.numbers.push(int)
})

Given("the following datatable:", (world, datatable: DataTable) => {
  world.datatable = datatable;
})

Given('the following numbers:', (world, numbers:DataTable) => {
  world.numbers = numbers.raw().map(n => parseInt(n[0][0]))
})

Given('the following json:', (world, json:string) => {
  world.json = JSON.parse(json)
})

Given('the following text:', (world, text:DocString) => {
  world.text = text
})

When('I set {string} to the json value', (world, prop) => {
  world[prop] = clone(world.json)
})

Then('the sum should be {int}', (world, int) => {
  expect(world.numbers.reduce((a,b) => a + b, 0)).toBe(int)
})

Then("the datatable should contain {string}", (world, value) => {
  const values = JSON.stringify(world.datatable);
  expect(values).toMatch(value);
});

Then("the json should contain {string}", (world, value) => {
  const values = JSON.stringify(world.json);
  expect(values).toMatch(value);
});

When('I set the data variable/value/property {string} to {string}', (world, prop, value) => {
  if (!world.data) world.data = {}
  set(world.data, prop, value)
})
When('I raw set the data variable/value/property {string} to {}', (world, prop, value) => {
  if (!world.data) world.data = {}
  set(world.data, prop, value)
})
Then('the variable/value/property/typeof {string} should include/contain/equal/match/be {string}', (world, prop, expected) => {
  let value = get(world,prop)
  let testValue = world.info.step.match(/^the typeof/) ? typeof value : value

  if (world.info.step.match(/" should (?:equal|match|be)"/)) expect(testValue?.toString() ?? '').toBe(expected)
  else expect(testValue?.toString() ?? '').toContain(expected)
})
Then('the variable/value/property {string} should be {int} character(s) long', (world, prop, length) => {
  let value = get(world,prop)
  expect(value?.toString()?.length).toBe(parseInt(length))
})

Then('(the )error {int} should contain {string}', async (world, idx, expected) => {
  let error = world.info.errors[idx-1]
  await expect(error.message).toContain(expected)
})
Then('(the )error {int} should contain the following text:', async (world, idx, expected) => {
  let error = world.info.errors[idx-1]
  await expect(error.message).toContain(expected.toString())
})
Then('the stack for error {int} should contain {string}', async (world, idx, expected) => {
  let stack = world.info.errors[idx-1].stack.split('\n')[0]
  await expect(stack).toContain(expected)
})
Then('clear error {int}', async (world, idx) => {
  world.info.errors.splice(idx-1, 1)
})
Then('clear {int} errors', async (world, idx) => {
  world.info.errors.splice(0, idx)
})

// FLAGS
When('I set a common flag', (world) => {
  world.common.flag = true
})
Then('the flag should be set', (world) => {
  expect(world.common.flag).toBe(true)
})

// CUSTOM PARAMETER TYPES
When('I push all the numbers {updown}( again)', (world, updown:'up'|'down') => {
  world.numbers = world.numbers.map(n => updown === 'up' ? n+1 : n-1)
})

// TIMEOUTS
When('a step takes too long', async function (world) {
  await new Promise(resolve => setTimeout(resolve, 10000));
});

// PRIORITY
Given('a step definition with a higher/lower priority passes/fails', async function (world){
  throw new Error('a step with a higher/lower priority passes/fails')
}, -1);
Given('a step definition with a higher/lower priority passes/fails', async function (world){
  // this step always passes
});
Given('a step definition with a higher priority fails', async function (world) {
  throw new Error('a step with a higher priority fails')
}, 1000);

// RENDERER

Given("the following feature( file)( is rendered):", (world, feature:DocString) => {
  world.data.featureText = feature;
  world.data.featureRendered = renderGherkin(world.data.featureText, world.data.featureConfig ?? {}, (world.data.featureText?.mediaType === 'md' || world.data.featureText?.mediaType === 'markdown'));
});
Given("the following feature( file)( is rendered): {string}", (world, feature:string) => {
  world.data.featureText = feature;
  world.data.featureRendered = renderGherkin(world.data.featureText, world.data.featureConfig ?? {}, (world.data.featureText?.mediaType === 'md' || world.data.featureText?.mediaType === 'markdown'));
});
Given("the following quickpickle config/configuration json/JSON:", (world, config:DocString) => {
  world.data.featureConfig = JSON.parse((config.toString()));
});
When("the feature is rendered", (world) => {
  world.data.featureRendered = renderGherkin(world.data.featureText, world.data.featureConfig ?? {}, (world.data.featureText?.mediaType === 'md' || world.data.featureText?.mediaType === 'markdown'));
});
Then("the rendered feature (file )should contain {string}", (world, expected) => {
  expect(world.data.featureRendered).toMatch(expected);
})
Then("the rendered feature (file )should contain:", (world, expected) => {
  expect(world.data.featureRendered).toMatch(
    // Create a new RegExp from the docString
    new RegExp(escapeRegExp(expected.toString())
      // Ignore omitted semicolons (in test code), number of newlines, or spacing at the start of lines
      .replace(/\n+/gm, ';?[\\n\\s]+')
      // Ignore newlines and spacing at the start of the test string
      .replace(/^/gm, '[\\n\\s]*'))
    );
})