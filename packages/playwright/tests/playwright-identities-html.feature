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

  @mobile @tablet @desktop @skip-ci
  Scenario: Browser sizes are set for new identities
    Given I load the file "tests/examples/simple.html"
    Then the screenshot "identity-browser-size" should match
    When I am a user "bob"
    Then the screenshot "identity-browser-size" should match
    Given a user "alice"
    When the browser size is set to 100x100
    But as "alice"
    Then the screenshot "identity-browser-size" should match

  Rule: One identity may use another identity's browser
    
    Each identity represents both a user and a browser. We treat the browser as
    a resource that can be shared by other entities, much like a computer might
    be shared by multiple individuals. So if Alice is using Bob's browser, she
    still has her own browser, and even if Bob uses Carol's browser, Alice is
    still using Bob's browser. At the end of the test, all browsers are closed.

    Scenario: Alice uses Bob's browser
      Given I am a user "Alice"
      And I am using the browser of "Bob"
      Then I should still be "Alice"
      But the browser for "Alice" should be "Bob"

    Scenario: Alice uses Bob's browser and Bob uses Carol's browser and Carol uses Alice's browser
      Given I am "Alice"
      And I am using Bob's browser
      Then I should still be "Alice"
      But the browser for "Alice" should be "Bob"
      And the browser for "Bob" should be "Bob"
      When Bob is using Carol's browser
      Then I should still be "Alice"
      And the browser for "Alice" should be "Bob"
      But the browser for "Bob" should be "Carol"
      When I am using Carol's browser
      Then the browser for "Alice" should be "Carol"
      When the user "Carol" is using the browser of "Alice"
      Then the browser for "Carol" should be "Alice"
      But the browser for "Alice" should still be "Carol"

    Scenario: Screen size and URL persist across an identity switch
      Given I am a user "Alice"
      And the browser size is set to 800 x 800
      And I load the file "tests/examples/example.html"
      Then the url should contain "example.html"
      And the browser size should be 800 x 800
      When I am using Bob's browser
      And the browser size is set to 400 x 600
      And I load the file "tests/examples/simple.html"
      Then the url should contain "simple.html"
      And the browser size should be 400 x 600
      When I am "Bob"
      Then the url should contain "simple.html"
      And the browser size should be 400 x 600
      When I am "Alice"
      And I am using my own browser
      Then the url should contain "example.html"

    @soft
    Scenario: using a browser that doesn't exist throws an error
      # this can only happen if someone sets things manually instead of using the API
      Given I am "Alice"
      When I am using a nonexistent browser
      When I load the file "tests/examples/simple.html"
      Then error 1 should contain "There is no page for identity"
      And clear error 1
