Feature: Multiple browsers with identities

  As a developer
  I need to be able to test multiple browsers at the same time, with different identities
  In order to test the interaction between users

  @soft
  Scenario: IndexedDB steps fail properly
    Given I am on "http://example.com"
    And a db record for "test" with value "does it work?"
    Then the db record for "test" should be "well does it?"
    Then error 1 should contain '"value": "does it work?"'
    And clear 1 error

  Scenario: IndexedDB is separate for each identity
    Given I am "user1"
    And I am on "http://example.com"
    And a db record for "test" with value "user1"
    When I am "user2"
    And I am on "http://example.com"
    Given a db record for "test" with value "user2"
    When I am "user1"
    Then the db record for "test" should be "user1"
