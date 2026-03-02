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
    Then I am the user "user2"
    And there is a db record for "test" with value "user2"
    Then as "user1"
    Then the db record for "test" should be "user1"

  Scenario: Creating vs switching identities
    Given I load the file "tests/examples/simple.html"
    # steps that only create a new identity
    Given an "admin"
    And a user "bob"
    And an "untrusted" browser
    Then I should still be "default"
    # steps that switch identity
    Then as an "admin"
    Then I should be "admin"
    And as the user "bob"
    Then I should be "bob"
    And as the "untrusted" browser
    Then I should be "untrusted"
    When I am "alice"
    Then I should be "alice"
    When I am a "user"
    Then I should be "user"
    When I am a "trusted" browser
    Then I should be "trusted"
    And as "someone else"
    Then I should be "someone else"

  @mobile @tablet @desktop
  Scenario: Browser sizes are set for new identities
    Given I load the file "tests/examples/simple.html"
    Then the screenshot "identity-browser-size" should match
    When I am a user "bob"
    Then the screenshot "identity-browser-size" should match
    Given a user "alice"
    When the browser size is set to 100x100
    But as "alice"
    Then the screenshot "identity-browser-size" should match
