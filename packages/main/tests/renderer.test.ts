import { expect, test, describe } from 'vitest'
import { renderGherkin } from '../src/render'
import { defaultConfig, normalizeTags } from '../src'
import fs from 'node:fs'

test('rendering the example feature file', () => {
  const featureFile = fs.readFileSync(__dirname + '/../gherkin-example/example.feature', 'utf8')
  const jsFile = fs.readFileSync(__dirname + '/../gherkin-example/example.feature.js', 'utf8')
  const testJs = renderGherkin(featureFile, {...defaultConfig, failTags: normalizeTags('fail, fails'), explodeTags: [normalizeTags('1a,1b'),normalizeTags('2a,2b')] })
  try {
    expect(jsFile).toEqual(testJs)
  }
  catch(e) {
    fs.writeFileSync(__dirname + '/../gherkin-example/example.feature.diff.js', testJs)
    throw e
  }
})
