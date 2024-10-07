
# language: en

@tag @multiple_tags
Feature: QuickPickle's Comprehensive Gherkin Syntax Example
  This is a description of the feature.
  It can span multiple lines and provides context.

  Background: Common setup steps'
    Given a common precondition
    And another common precondition

  @scenario_tag
  Scenario: Basic scenario example'
    Given an initial context'
    When an action is performed'
    Then a verifiable outcome is achieved'

  Scenario Outline: Parameterized scenario for <parameter>, '<another_parameter>'
    Given a 'precondition' with <parameter>
    When an 'action' is taken with <another_parameter>
    Then the 'outcome' is <expected_result>

    Examples:
      | parameter | another_parameter | expected_result |
      | value1'   | value2'           | result1'        |
      | value3`   | value4`           | result2`        |

  @data_table
  Scenario: Scenario with various DataTable types
    Given a list of strings:
      | Apple'  |
      | Banana` |
      | Cherry" |
    And a list of integers:
      | 1 |
      | 2 |
      | 3 |
    And a map of string to string:
      | key1' | value1' |
      | key2` | value2" |
    And a list of maps:
      | name'    | age` | role"    |
      | Alice'   | 30   | admin"   |
      | Bob`     | 25   | user"    |
    And a map of string to list of string:
      | fruits     | Apple, Banana, Cherry |
      | vegetables | Carrot, Potato, Onion |
    When they are processed
    Then the system behaves correctly

  @rule_tag
  Rule: Business rule description'
    This is an example of a business rule'

    Background: Rule-specific setup'
      Given a specific rule context
      And another specific rule context

    Example: Rule example scenario'
      Given a specific rule context
      When a rule-related action occurs
      Then the rule outcome is observed

  Scenario: Also a rule example'
    Given a Rule statement
    When a scenario is below it
    Then it is a child of the Rule, even if it isn't indented

  # The @wip (work in progress) and @skip tags are often used to skip some tests,
  # but this depends on implementation.
  @wip @skip
  Scenario: Scenario with doc string
    Given a document with the following content:
      """
      This is a doc string.
      It can contain multiple lines.
      Useful for specifying larger text inputs.
      """
    When the document is processed
    Then the system handles it correctly

  Scenario: Scenario with content type doc string
    Given a document with the following Markdown content:
      """markdown
      Lorem Ipsum
      ===============
      Lorem ipsum dolor sit amet,
      consectetur adipiscing elit.
      """

  Scenario: Scenario with And and But steps
    Given an initial state
    And some additional context
    When an action is performed
    And another action is performed
    Then some assertion is made
    But some exception is also handled

  @failing
  Scenario: Failing scenario example
    Given a condition that will fail
    When an impossible action is attempted
    Then an unreachable assertion is made

    Rule: Rules don't nest
      This is a Rule that is indented under a previous Rule

      Example: This rule doesn't nest
        Given a Rule statement
        When another Rule is indented below it
        Then the indented Rule is NOT a child of the previous Rule
