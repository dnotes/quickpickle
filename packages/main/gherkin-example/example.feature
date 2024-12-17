
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

  @concurrent
  Scenario Outline: Parameterized scenario for <parameter>, '<5>', "<expected_result*>"
    Given a 'precondition' with <parameter>
    When an "action" is taken with <5>
    Then the `outcome` is <expected_result*>

    Examples:
      | parameter | 5       | expected_result* |
      | value1'   | value2' | result1'         |
      | value3`   | value4` | result2`         |
      | value5"   | value6" | result3"         |

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
  @sequential
  Scenario: Scenario with And and But steps
    Given an initial state
    And some additional context
    When an action is performed
    And another action is performed
    Then some assertion is made
    But some exception is also handled

  @fails
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

  @1a @1b
  Scenario: Exploded tags make multiple tests
    Given an explodedTags config of [[ '@1a','@1b' ], [ '@2a','@2b' ]]
    When this Scenario is run
    Then it should be split into 2 tests

  @1a @1b @2a @2b @tag3
  Scenario: More tags make more tests
    Given an explodedTags config of [[ '@1a','@1b' ], [ '@2a','@2b' ]]
    When this Scenario is run
    Then it should be split into 4 tests

  Scenario Outline: Search Ordering: <searchPhrase> (<religion>) <context>
    When I search for "<searchPhrase>" and get results from 500 books
    Then I should see search results with these metrics:
      | Book Importance | Match Quality | score |
      | primary         | exact         | 3+5=8 |
    And next I should see search results with these metrics:
      | secondary       | exact         | 2+5=7 |
    Examples:
      | searchPhrase                                      | religion    | context                                   |
      | ablution                                          | Bahá’í      | teachings on prayer                       |
      | achieving enlightenment                           | Buddhist    | purpose of existence                      |
      | achieving immortality                             | Taoist      | purpose of existence                      |
      | acts of kindness                                  | Jewish      | teachings on charity                      |

  Scenario Outline: `someone` is ${sneaky} \${with} \\${backslashes} \\\${and} \$\{other} \`things\\` 'like' \'quotes\\'
    Given a "string with \"quotes\""
    And `someone` is ${sneaky} \${with} \\${backslashes} \\\${and} \$\{other} \`things\\` 'like' \'quotes\\'
    Examples:
    | 1     | 2     | 3       |
    | \'a\' | \`b\` | \"c\"   |
    | ${a}  | \${b} | \\${c}  |
    | `a`   | \`b\` | \\`c\\` |

  Scenario: `someone` is ${sneaky} \${with} \\${backslashes} \\\${and} \$\{other} \`things\\` 'like' \'quotes\\'
    Given a "string with \"quotes\""
    And `someone` is ${sneaky} \${with} \\${backslashes} \\\${and} \$\{other} \`things\\` 'like' \'quotes\\'

  Scenario Outline: DataTables row: <Row>
    Given the following datatable:
      | Product    | Quantity |
      | <Product1> | <Qty1>   |
      | <Product2> | <Qty2>   |
    Then datatable should contain "<Product1>"

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
    Then json should contain "<Product1>"

    Examples:
      | Row | Product1 | Qty1 | Product2 | Qty2 |
      | 0   | Widget A | 2    | Widget B | 3    |
      | 1   | Widget C | 1    | Widget D | 4    |
