Feature: Basic Test

  Scenario: It works
    Given I run the tests
    Then the tests should pass

  Scenario: It has a world
    Given I have a number 2
    And I have a number 3
    Then the sum should be 5

  Rule: Every step must have access to information about itself
    This is so we can know what is happening when writing step definitions

    @tag-test
    Example: The world has info
      Given I run the tests
      Then the property "info.feature" should include "Basic Test"
      And the property "info.rule" should include "Every step must have access to information about itself"
      And the property "info.scenario" should include "The world has info"
      And the property "info.tags" should include "@tag-test"
      And the property "info.step" should include "FWAH!!! (or really whatever you write here, since it's part of the step)"
      And the property "info.line" should include "23"
      And the typeof "info.explodeIdx" should be "undefined"
      And the property "info.stepIdx" should include "9"
      And the property "info.steps" should contain 'Then the property "info.feature" should include "Basic Test"'
      And the property "config.softFailTags" should contain "@soft"

  Rule: The error messages must be useful

    @soft
    Scenario: The line numbers must match the actual .feature file
      Given I run the tests
      When the tests fail
      Then the stack for error 1 should contain "test.feature:34:1"
      And clear error 1

  Rule: softFailTags should collect all errors before failing a scenario

    @soft
    Scenario: Multiple errors are condensed into one
      Given I run the tests
      When the tests fail
      And the tests fail
      Then the stack for error 1 should contain "test.feature:43:1"
      And the stack for error 2 should contain "test.feature:44:1"
      And clear 2 errors

    @fails @soft
    Scenario: Soft fail scenarios still fail at the end unless the errors are cleared
      Given the tests fail

  Rule: the "common" element should work across tests

    Example: Setting a common property
      When I set a common flag

    Example: Getting a common property
      Then the flag should be set

  Rule: DataTables and DocStrings must work like in @cucumber/cucumber
    Because why re-invent what is pretty good

    Example: DataTables work
      Given the following numbers:
        | 1 |
        | 2 |
        | 3 |
      Then the sum should be 6

    Example: DocStrings work
      Given the following json:
        ```
          [1,2,3]
        ```
      When I set "numbers" to the json value
      Then the sum should be 6

    Example: DocStrings can have a custom mediaType, per Gherkin 6
      Given the following text:
        ```md
          # Title

          This is some markdown text
        ```
      Then the value "text" should include "# Title"
      And the variable "text.mediaType" should be "md"
      And the typeof "text" should be "object"

    Example: DocStrings expand json into an object
      Given the following text:
        ```json
          {
            "foo": "bar"
          }
        ```
      Then the value "text.data.foo" should be "bar"
      And the variable "text.mediaType" should be "json"
      And the typeof "text" should be "object"

    @soft
    Example: DocStrings throw an error if json data doesn't parse properly
      Given the following text:
        ```json
          {
            foo: "invalid json"
          }
        ```
      Then the error 1 should contain "parsing json content failed"
      And clear error 1

    Example: DocStrings expand yaml into an object
      Given the following text:
        ```yaml
          foo: bar
        ```
      Then the value "text.data.foo" should be "bar"
      And the variable "text.mediaType" should be "yaml"
      And the typeof "text" should be "object"

    @soft
    Example: DocStrings throw an error if yaml data doesn't parse properly
      Given the following text:
        ```yaml
          foo: bar: baz #invalid yaml!
        ```
      Then the error 1 should contain "parsing yaml content failed"
      And clear error 1

    

  Rule: Scenario Outlines must work

    Scenario Outline: Adding numbers: <int1> + <int2> = <sum>
      Given I have a number <int1>
      And I have a number <int2>
      Then the sum should be <sum>

      Examples:
        | int1 | int2 | sum |
        | 1    | 2    | 3   |
        | 2    | 3    | 5   |
        | 3    | 5    | 8   |
        | 5    | 8    | 13  |
        | 8    | 13   | 21  |
        | 13   | 21   | 34  |

    Scenario Outline: Replacements in strings work for <prop>:<value> (<length>)
      Given I set the data property "<prop>" to "<value>"
      Then the variable "data.<prop>" should be "<value>"
      And the variable "data.<prop>" should be <length> characters long

      Examples:
        | prop | value | length |
        | foo  | bar   | 3      |
        | fwah | fwee  | 4      |

    Scenario Outline: DataTables row: <Row>
      Given the following datatable:
        | Product    | Quantity |
        | <Product1> | <Qty1>   |
        | <Product2> | <Qty2>   |
      Then the datatable should contain "<Product1>"
      And the datatable should contain "<Qty1>"
      And the datatable should contain "<Product2>"
      And the datatable should contain "<Qty2>"

      Examples:
        | Row | Product1 | Qty1 | Product2 | Qty2 |
        | 0   | Widget A | 2    | Widget B | 3    |
        | 1   | Widget C | 1    | Widget D | 4    |

    Scenario Outline: DocStrings row: <Row>
      And the following json:
        """
        {
          "<Product1>": "<Qty1>",
          "<Product2>": "<Qty2>"
        }
        """
      Then the json should contain "<Product1>"
      And the json should contain "<Qty1>"
      And the json should contain "<Product2>"
      And the json should contain "<Qty2>"

      Examples:
        | Row | Product1 | Qty1 | Product2 | Qty2 |
        | 0   | Widget A | 2    | Widget B | 3    |
        | 1   | Widget C | 1    | Widget D | 4    |

  Rule: Vitest "todo", "skip", "fails" should work out of the box

    @todo
    Example: I haven't written this test yet

    @skip
    Example: This is a skipped test
      Given I run the tests
      Then the tests should pass

    @fails
    Example: This is a failing test
      Given I run the tests
      Then the tests should fail

  @explodeTags
  Rule: Vitest extensions like "skip" should respect explodeTags definitions

    Background:
      # We define tests for "@legacy" and "@next", then run tests only for "@next".
      # This can be done with two separate Vitest project configurations, running
      # "@legacy" tests in one config, and "@next" tests in the other.
      Given the following quickpickle config json
        ```json
        {
          "skipTags": [ "@legacy" ],
          "explodeTags": [
            [ "@legacy", "@next" ]
          ]
        }
        ```

      Scenario: A scenario for both "@legacy" and "@next"
        When the following feature is rendered:
          ```gherkin
          Feature: Test

            @legacy @next
            Scenario: Test for both
              Then the scenario should be both skipped and run
          ```
        Then the rendered feature should contain "test.skip('Scenario: Test for both (@legacy)',"
        And the rendered feature should contain "test('Scenario: Test for both (@next)',"
        And the rendered feature file should match the snapshot

      Scenario: A "@legacy" feature with a "@next" scenario
        When the following feature is rendered:
          ```gherkin
          @legacy
          Feature: Legacy test

            Scenario: Test for legacy
              Then the scenario should be skipped
            
            @next
            Scenario: Test for both
              Then the scenario should be both skipped and run
          ```
        Then the rendered feature should contain "test.skip('Scenario: Test for legacy (@legacy)',"
        And the rendered feature should contain "test.skip('Scenario: Test for both (@legacy)',"
        And the rendered feature should contain "test('Scenario: Test for both (@next)',"
        And the rendered feature file should match the snapshot

      Scenario: A "@legacy" rule with a "@next" scenario
        When the following feature is rendered:
          ```gherkin
          Feature: Test

            @legacy
            Rule: Legacy rule

              Scenario: Test for legacy
                Then the scenario should be skipped
              
              @next
              Scenario: Test for both
                Then the scenario should be both skipped and run
          ```
        Then the rendered feature should contain "test.skip('Scenario: Test for legacy (@legacy)',"
        And the rendered feature should contain "test.skip('Scenario: Test for both (@legacy)',"
        And the rendered feature should contain "test('Scenario: Test for both (@next)',"
        And the rendered feature file should match the snapshot

      Scenario: A "@next" feature with a "@legacy" scenario
        When the following feature is rendered:
          ```gherkin
          @next
          Feature: Next test

            Scenario: Test for next
              Then the scenario should be run

            @legacy
            Scenario: Test for both
              Then the scenario should be both skipped and run
          ```
        Then the rendered feature should contain "test('Scenario: Test for next (@next)',"
        And the rendered feature should contain "test('Scenario: Test for both (@next)',"
        And the rendered feature should contain "test.skip('Scenario: Test for both (@legacy)',"
        And the rendered feature file should match the snapshot

      Scenario: A "@next" rule with a "@legacy" scenario
        When the following feature is rendered:
          ```gherkin
          Feature: Test
 
            @next
            Rule: Next rule

              Scenario: Test for next
                Then the scenario should be run

              @legacy
              Scenario: Test for both
                Then the scenario should be both skipped and run
          ```
        Then the rendered feature should contain "test('Scenario: Test for next (@next)',"
        And the rendered feature should contain "test('Scenario: Test for both (@next)',"
        And the rendered feature should contain "test.skip('Scenario: Test for both (@legacy)',"
        And the rendered feature file should match the snapshot

  Rule: Tests must have appropriate guards against escaping
    #        | character 14 - 13 = 1                                                   character 113 - 13 = 100 |
    Example: `someone` is ${sneaky} \${with} \\${backslashes} \\\${and} \$\{other} \`things\\` 'like' \'quotes\\'
      When I set the data variable "escapedDoubleQuote" to "\""
      And I set the data variable "escapedSingleQuote" to "\'"
      And I set the data variable "escapedBacktick" to "\`"
      And I set the data variable "doubleEscapedDoubleQuote" to "\\'"
      And I set the data variable "doubleEscapedSingleQuote" to "\\'"
      And I set the data variable "doubleEscapedBacktick" to "\\`"
      And I set the data variable "unescapedError" to "${throw new Error(muuahahaha!)}"
      And I set the data variable "escapedError" to "\${throw new Error(muuahahaha!)}"
      Then the variable "data.escapedDoubleQuote" should be 1 character long
      And the variable "data.escapedSingleQuote" should be 1 character long
      And the variable "data.escapedBacktick" should be 2 characters long
      And the variable "data.doubleEscapedDoubleQuote" should be 2 character long
      And the variable "data.doubleEscapedSingleQuote" should be 2 character long
      And the variable "data.doubleEscapedBacktick" should be 3 characters long
      And the variable "data.unescapedError" should be 31 characters long
      And the variable "data.escapedError" should be 32 characters long
      And the variable "info.scenario" should be 100 characters long

    Example: Outside a {string} variable, escaped quotes are two characters, but the file is still safe
      When I raw set the data variable "escapedDoubleQuote" to \"
      And I raw set the data variable "escapedSingleQuote" to \'
      And I raw set the data variable "escapedBacktick" to \`
      And I raw set the data variable "doubleEscapedDoubleQuote" to \\"
      And I raw set the data variable "doubleEscapedSingleQuote" to \\'
      And I raw set the data variable "doubleEscapedBacktick" to \\`
      And I raw set the data variable "unescapedError" to ${throw new Error(muuahahaha!)}
      And I raw set the data variable "escapedError" to \${throw new Error(muuahahaha!)}
      Then the variable "data.escapedDoubleQuote" should be 2 characters long
      And the variable "data.escapedSingleQuote" should be 2 characters long
      And the variable "data.escapedBacktick" should be 2 characters long
      And the variable "data.doubleEscapedDoubleQuote" should be 3 character long
      And the variable "data.doubleEscapedSingleQuote" should be 3 character long
      And the variable "data.doubleEscapedBacktick" should be 3 characters long
      And the variable "data.unescapedError" should be 31 characters long
      And the variable "data.escapedError" should be 32 characters long

  Rule: Custom parameter types must work

    Example: a custom parameter for up or down
      Given a number 1
      And a number 2
      Then the sum should be 3
      When I push all the numbers up
      Then the sum should be 5
      When I push all the numbers down
      And I push all the numbers down again
      Then the sum should be 1

    @fails @soft
    Example: a custom parameter only matches its exact regex
      Given a number 1
      When I push all the numbers right
      Then the error 1 should contain "Undefined. Implement with the following snippet:"

  @snippets @soft
  Rule: Snippets must be helpful

    Example: a custom parameter works
      Given the phrase goes up
      Then error 1 should contain the following text:
        """js
        Given('the phrase goes {updown}', async function (world, updown) {
          // Write code here that turns the phrase above into concrete actions
          throw new Error('Not yet implemented')
        });
        """
      And clear error 1

    Example: multiple parameters work
      When a phrase with "first" and "second"
      Then error 1 should contain the following text:
        ```js
        When('a phrase with {string} and {string}', async function (world, string, string2) {
          // Write code here that turns the phrase above into concrete actions
          throw new Error('Not yet implemented')
        });
        ```
      And clear error 1

    Example: DataTables work
      And a step with a DataTable:
        | key | value      |
        | 1   | data table |
      And error 1 should contain "Given('a step with a DataTable:', async function (world, dataTable)"
      And clear error 1

    Example: DocStrings should work
      Then a step with a DocString:
        """
          this is a DocString.
        """
      Then error 1 should contain "Then('a step with a DocString:', async function (world, docString)"
      And clear error 1

    Example: no variables should work
      Given this step is undefined
      Then error 1 should contain "Given('this step is undefined', async function (world) {"
      And clear error 1

  @soft
  Rule: Steps should have a timeout

    Example: a test with a step that times out
      When a step takes too long
      Then error 1 should contain "a step takes too long"
      And error 1 should contain "timed out after"
      And clear error 1

  @priority
  Rule: Steps can override others through priority

    Example: A step with a higher priority overrides a lower one
      Given a step definition with a lower priority fails
      And a step definition with a higher priority passes
      Then the tests should pass

    @soft
    Example: A step with a higher priority can be more specific
      Given a step definition with a lower priority passes
      And a step definition with a higher priority fails
      Then error 1 should contain "a step definition with a higher priority fails"
      And clear error 1
      And the tests should pass