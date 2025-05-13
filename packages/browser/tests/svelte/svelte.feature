Feature: svelte__hello

  Scenario: Initial rendering
    Given I render "Hello.svelte"
    Then I should see "Hello world!"

  Scenario: Name is changed reactively
    Given I render "Hello.svelte"
    When for "Name" I enter "reactive variable"
    Then I should see "Hello reactive variable!"

  Scenario: Render with properties
    Given I render "Hello.svelte" with the following properties:
      | name | property |
    Then I should see "Hello property!"
