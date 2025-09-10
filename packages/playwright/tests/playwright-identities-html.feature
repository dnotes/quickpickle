@webserver
Feature: Multiple browsers with identities

  As a developer
  I need to be able to test multiple browsers at the same time, with different identities
  In order to test the interaction between users

  @soft
  Scenario: IndexedDB steps fail properly
    Given I am on the front page
    And a db record for "test" with value "does it work?"
    Then the db record for "test" should be "well does it?"
    Then error 1 should contain '"value": "does it work?"'
    And clear 1 error

  Scenario: IndexedDB is separate for each identity
    Given I am on the front page
    Given I am a user "user1"
    And there is a db record for "test" with value "user1"
    Given a user "user2"
    And a db record for "test" with value "user2"
    Then as "user1"
    Then the db record for "test" should be "user1"
