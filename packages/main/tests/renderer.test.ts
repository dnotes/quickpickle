import { expect, test } from 'vitest'
import { renderGherkin } from '../src/render'
import fs from 'node:fs'

const featureFile = fs.readFileSync(__dirname + '/../gherkin-example/example.feature', 'utf8')
const jsFile = fs.readFileSync(__dirname + '/../gherkin-example/example.feature.js', 'utf8')

test('rendering the example feature file', () => {
  expect(jsFile).toEqual(renderGherkin(featureFile, {}))
})