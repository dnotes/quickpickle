import { getSteps } from '$lib/helpers.js'
import fs from 'node:fs'
const stepfile = fs.readFileSync('./node_modules/quickpickle/playwright/steps.ts', 'utf8')

export async function load() {
  let stepDefinitions = getSteps(stepfile)
  return {
    stepDefinitions
  }
}
