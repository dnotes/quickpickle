import { expect, test } from 'vitest'
import { renderGherkin } from '../src/render'
import { defaultConfig, normalizeTags } from '../src'
import fs from 'node:fs'

const featureFile = fs.readFileSync(__dirname + '/../gherkin-example/example.feature', 'utf8')
const jsFile = fs.readFileSync(__dirname + '/../gherkin-example/example.feature.js', 'utf8')

test('rendering the example feature file', () => {
  expect(jsFile).toEqual(renderGherkin(featureFile, {...defaultConfig, failTags: normalizeTags('fail, fails'), explodeTags: [normalizeTags('1a,1b'),normalizeTags('2a,2b')] }))
})