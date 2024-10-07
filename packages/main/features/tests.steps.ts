import { expect } from "vitest";
import { Given, Then, When } from "../src";
import { DataTable } from "@cucumber/cucumber";
import { clone, get } from "lodash-es";
import { DocString } from "../src/models/doc_string";

Given("I run the tests", () => {});

Then("the tests should pass", () => {
  expect(true).to.be.true;
})

Given('I have a number {int}', (world, int) => {
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

Then('the variable/value/property/typeof {string} should include/contain/equal/match/be {string}', (world, prop, expected) => {
  let value = get(world,prop)
  let testValue = world.info.step.match(/^the typeof/) ? typeof value : value

  if (world.info.step.match(/" should (?:equal|match|be)"/)) expect(testValue?.toString() ?? '').toBe(expected)
  else expect(testValue?.toString() ?? '').toContain(expected)
})
