Feature: Rendering engine

  Rule: Empty Features and Rules should be allowed

    Scenario: Render completely empty feature file
      Given the following feature file is rendered: ""
      Then the rendered feature file should contain:
        ```js
        import { test } from 'vitest'
        test.skip('')
        ```

    Scenario Outline: Render empty Features
      Given the following feature file is rendered: "<feature>"
      Then the rendered feature file should contain:
        ```js
        , () => {
          test.skip('')
        })
        ```

      Examples:
        | feature |
        | Feature: |
        | Feature: Empty |

    Scenario: Render empty features with descriptions
      Given the following feature file is rendered:
        ```gherkin
        Feature: Empty

          As a developer or project lead
          I want to be able to write empty Feature files
          In anticipation of future development
        ```
      Then the rendered feature file should contain "describe('Feature: Empty', () => {"
      And the rendered feature file should contain:
        ```js
        , () => {
          test.skip('')
        })
        ```

    Scenario: Render empty Rules without error
      Given the following feature file:
        ```gherkin
        Feature: Empty Rules

          Rule: Empty
        ```
      When the feature is rendered
      Then the rendered feature file should contain:
      ```js
      describe('Rule: Empty', () => {
        const initRuleScenario = async (context, scenario, tags, steps) => {
          let state = await initScenario(context, scenario, tags, steps)
          state.info.rule = 'Empty'
          return state
        }
        test.skip('')
      })
      ```

    Scenario: Render empty Rules with descriptions
      Given the following feature file:
        ```gherkin
        Feature: Empty Rules

          Rule: Empty
            Rules can have descriptions too
        ```
      When the feature is rendered
      Then the rendered feature file should contain:
      ```js
      describe('Rule: Empty', () => {
        const initRuleScenario = async (context, scenario, tags, steps) => {
          let state = await initScenario(context, scenario, tags, steps)
          state.info.rule = 'Empty'
          return state
        }
        test.skip('')
      })
      ```
