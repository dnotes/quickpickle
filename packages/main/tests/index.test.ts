import { describe, expect, test, ResolvedConfig } from 'vitest'
import { quickpickle } from '../src/index'


describe('quickpickle plugin function', async () => {
  const passedConfig = {
    skipTags: ['@overwritten-skip'],
    todoTags: ['@real-todo'],
    worldConfig: {
      headless: false,
      slowMo: 50,
    }
  }

  const viteConfig = {
    quickpickle: { skipTags: ['@real-skip'] }
  }
  const plugin = quickpickle(passedConfig)

  const featureText = `
@overwritten-skip @skip
Feature: Test Feature

  @real-todo
  Scenario: Not skipped, but todo

  @real-skip
  Scenario: Skipped
    Given I run the tests
`

  // @ts-ignore because we just need to check that the config is resolved in our plugin
  plugin.configResolved(viteConfig)
  // @ts-ignore
  const output = await plugin.transform(featureText, 'test.feature')
  console.log(output)

  test('transform function overwrites default config with passed config, then vite config', () => {
    expect(output).toContain(`test.todo('Scenario: Not skipped, but todo`)
    expect(output).toContain(`test.skip('Scenario: Skipped`)
    expect(output).not.toContain(`describe.skip`)
  })

  test('transform function writes worldConfig to output', () => {
    expect(output).toContain(`"slowMo":50`)
    expect(output).toContain(`"headless":false`)
  })

})

