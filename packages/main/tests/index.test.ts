import { describe, expect, test, ResolvedConfig } from 'vitest'
import { quickpickle } from '../src/index'


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
    expect(output2).not.toMatch(/test\.concurrent[\s\S]+?test\.concurrent[/s/S]+?test\.concurrent/m)
  })

})

