import { describe, expect, test, ResolvedConfig } from 'vitest'
import { explodeTags, quickpickle } from '../src/index'
import { explodeArray } from '../src/render'

describe('quickpickle plugin function', async () => {
  const passedConfig = {
    skipTags: ['@overwritten-skip'],
    todoTags: ['@real-todo'],
    explodeTags: 'chromium,firefox,webkit',
    worldConfig: {
      headless: false,
      slowMo: 50,
    }
  }

  const viteConfig = {
    quickpickle: { skipTags: ['@real-skip'] }
  }
  const plugin = quickpickle(passedConfig)

  // @ts-ignore because we just need to check that the config is resolved in our plugin
  plugin.configResolved(viteConfig)

  let feature1 = `
@overwritten-skip @skip
Feature: Test Feature

  @real-todo
  Scenario: Not skipped, but todo
    Given I run the tests

  @real-skip
  Scenario: Skipped
    Given I run the tests
`
  // @ts-ignore
  let output = await plugin.transform(feature1, 'test.feature')
  test('transform function overwrites default config with passed config, then vite config', () => {
    expect(output).toContain(`test.todo('Scenario: Not skipped, but todo`)
    expect(output).toContain(`test.skip('Scenario: Skipped`)
    expect(output).not.toContain(`describe.skip`)
  })
  test('transform function writes worldConfig to output', () => {
    expect(output).toContain(`"slowMo":50`)
    expect(output).toContain(`"headless":false`)
  })

  let feature2 = `
Feature: Exploding Tags
  @chromium @firefox @concurrent
  Scenario: Multiple browsers
    Given I run the tests
`
  // @ts-ignore
  let output2 = await plugin.transform(feature2, 'test.feature')
  test('exploding tags work as expected', () => {
    expect(output2).toMatch(/test\.concurrent[\s\S]+?test\.concurrent/m)
    expect(output2).toMatch(/I run the tests`, state, 5, 1, 1\)/m)
    expect(output2).toMatch(/I run the tests`, state, 5, 1, 2\)/m)
    expect(output2).not.toMatch(/test\.concurrent[\s\S]+?test\.concurrent[/s/S]+?test\.concurrent/m)
  })

})

describe('explodeArray function', () => {
  test('explode [1a,1b]', () => {
    expect(explodeArray([['@1a','@1b']])).toEqual([
      ['@1a'],
      ['@1b'],
    ])
  })
  test('explode [1a,1b],[]', () => {
    expect(explodeArray([['@1a','@1b'],[]])).toEqual([
      ['@1a'],
      ['@1b'],
    ])
  })
  test('explodeArray [1a,1b],[2a]', () => {
    expect(explodeArray([['@1a','@1b'], ['@2a']])).toEqual([
      ['@1a', '@2a'],
      ['@1b', '@2a'],
    ])
  })
  test('explodeArray [1a,1b],[2a,2b]', () => {
    expect(explodeArray([['@1a','@1b'], ['@2a', '@2b']])).toEqual([
      ['@1a', '@2a'],
      ['@1a', '@2b'],
      ['@1b', '@2a'],
      ['@1b', '@2b'],
    ])
  })
  test('explodeArray [1a,1b],[2a],[3a]', () => {
    expect(explodeArray([['@1a','@1b'], ['@2a'], ['@3a']])).toEqual([
      ['@1a', '@2a', '@3a'],
      ['@1b', '@2a', '@3a'],
    ])
  })
  test('explodeArray [1a,1b],[2a],[3a,3b]', () => {
    expect(explodeArray([['@1a','@1b'], ['@2a'], ['@3a','@3b']])).toEqual([
      ['@1a', '@2a', '@3a'],
      ['@1a', '@2a', '@3b'],
      ['@1b', '@2a', '@3a'],
      ['@1b', '@2a', '@3b'],
    ])
  })
  test('explodeArray [],[2a,2b],[3a,3b]', () => {
    expect(explodeArray([[], ['@2a', '@2b'], ['@3a','@3b']])).toEqual([
      ['@2a', '@3a'],
      ['@2a', '@3b'],
      ['@2b', '@3a'],
      ['@2b', '@3b'],
    ])
  })
  test('explodeArray [1a,1b],[2a,2b,2c],[3a,3b]', () => {
    expect(explodeArray([['@1a','@1b'], ['@2a','@2b','@2c'], ['@3a','@3b']])).toEqual([
      ['@1a', '@2a', '@3a'],
      ['@1a', '@2a', '@3b'],
      ['@1a', '@2b', '@3a'],
      ['@1a', '@2b', '@3b'],
      ['@1a', '@2c', '@3a'],
      ['@1a', '@2c', '@3b'],
      ['@1b', '@2a', '@3a'],
      ['@1b', '@2a', '@3b'],
      ['@1b', '@2b', '@3a'],
      ['@1b', '@2b', '@3b'],
      ['@1b', '@2c', '@3a'],
      ['@1b', '@2c', '@3b'],
    ])
  })
})

describe('explodeTags function', () => {
  test('simple nojs setup - explode [nojs,js]', () => {
    expect(explodeTags([['@nojs','@js']], ['@nojs', '@js'])).toEqual([
      ['@nojs'],
      ['@js'],
    ])
  })
  test('strange but valid nojs setup - explode [nojs,js]', () => {
    expect(explodeTags([['@nojs','@js'],[]], ['@nojs', '@js'])).toEqual([
      ['@nojs'],
      ['@js'],
    ])
  })
  describe('common playwright setup', () => {
    let explodedTags = [
      ['@nojs', '@js'],
      ['@chromium', '@firefox', '@webkit'],
      ['@mobile', '@tablet', '@desktop', '@widescreen'],
    ]
    test('explode [nojs,js]', () => {
      expect(explodeTags(explodedTags, ['@nojs', '@js'])).toEqual([
        ['@nojs'],
        ['@js'],
      ])
    })
    test('explode [concurrent,sequential,nojs,js]', () => {
      expect(explodeTags(explodedTags, ['@concurrent','@sequential','@nojs','@js'])).toEqual([
        ['@concurrent','@sequential','@nojs'],
        ['@concurrent','@sequential','@js'],
      ])
    })
    test('explode [concurrent,nojs,js,sequential]', () => {
      expect(explodeTags(explodedTags, ['@concurrent','@nojs','@js','@sequential'])).toEqual([
        ['@concurrent','@sequential','@nojs'],
        ['@concurrent','@sequential','@js'],
      ])
    })
    test('explode [concurrent,nojs,js,sequential,webkit,mobile,desktop]', () => {
      expect(explodeTags(explodedTags, ['@concurrent','@nojs','@js','@sequential','@webkit','@mobile','@desktop'])).toEqual([
        ['@concurrent','@sequential','@nojs','@webkit','@mobile'],
        ['@concurrent','@sequential','@nojs','@webkit','@desktop'],
        ['@concurrent','@sequential','@js','@webkit','@mobile'],
        ['@concurrent','@sequential','@js','@webkit','@desktop'],
      ])
    })
    test('explode [nojs,js,othertag]', () => {
      expect(explodeTags(explodedTags, ['@nojs','@js','@othertag'])).toEqual([
        ['@othertag','@nojs'],
        ['@othertag','@js'],
      ])
    })
    test('explode [concurrent,nojs,js,sequential,mobile,tablet,desktop,firefox,chromium,screenshot,show-browser]', () => {
      expect(explodeTags(explodedTags, ['@concurrent', '@nojs', '@js', '@sequential', '@mobile', '@tablet', '@desktop', '@firefox', '@chromium', '@screenshot', '@show-browser'])).toEqual([
        ['@concurrent', '@sequential', '@screenshot', '@show-browser', '@nojs', '@chromium', '@mobile'],
        ['@concurrent', '@sequential', '@screenshot', '@show-browser', '@nojs', '@chromium', '@tablet'],
        ['@concurrent', '@sequential', '@screenshot', '@show-browser', '@nojs', '@chromium', '@desktop'],
        ['@concurrent', '@sequential', '@screenshot', '@show-browser', '@nojs', '@firefox', '@mobile'],
        ['@concurrent', '@sequential', '@screenshot', '@show-browser', '@nojs', '@firefox', '@tablet'],
        ['@concurrent', '@sequential', '@screenshot', '@show-browser', '@nojs', '@firefox', '@desktop'],
        ['@concurrent', '@sequential', '@screenshot', '@show-browser', '@js', '@chromium', '@mobile'],
        ['@concurrent', '@sequential', '@screenshot', '@show-browser', '@js', '@chromium', '@tablet'],
        ['@concurrent', '@sequential', '@screenshot', '@show-browser', '@js', '@chromium', '@desktop'],
        ['@concurrent', '@sequential', '@screenshot', '@show-browser', '@js', '@firefox', '@mobile'],
        ['@concurrent', '@sequential', '@screenshot', '@show-browser', '@js', '@firefox', '@tablet'],
        ['@concurrent', '@sequential', '@screenshot', '@show-browser', '@js', '@firefox', '@desktop'],
      ])
    })
  })
})