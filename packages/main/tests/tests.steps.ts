import { expect } from "vitest";
import { Given, Then, When, defineParameterType } from "../src";
import type { DataTable } from "../src";
import { clone, get, set } from "lodash-es";
import type { DocString } from "../src/models/DocString";

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