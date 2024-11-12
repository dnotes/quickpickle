@sequential
Feature: Testing hooks

  As a behavioral test writer
  I need a consistent way to run code before and after steps, scenarios, and test runs

  Scenario: Hooks: The BeforeAll hook can set things in common
    Then the variable "common.beforeAll" should be "beforeAll"
    And the typeof "common.taggedBeforeAll" should be "undefined"

  Scenario: Hooks: All hooks should work
    Given I run the tests
    Then the tests should pass

  @soft
  Scenario: Hooks: Hooks also work on @soft tests
    Given I run the tests
    Then the tests should pass

  @fails
  Scenario: Hooks: Errors are available in the hook
    Given I run the tests
    Then the tests should fail

  @clearErrorsAfterStep @soft
  Scenario: Hooks: The AfterStep hook can clear errors
    Given I run the tests
    Then the tests should fail

  @clearErrorsAfterStep @fails
  Scenario: Hooks: AfterStep must be @soft when clearing errors, or the test still fails
    Given I run the tests
    Then the tests should fail

  @soft @fails
  Scenario: Hooks: If the errors are not cleared, a @soft test still fails
    Given I run the tests
    Then the tests should fail
