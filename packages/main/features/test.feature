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
      And the property "info.step" should include 'the test "step" should include'
      And the property "info.line" should include "23"

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