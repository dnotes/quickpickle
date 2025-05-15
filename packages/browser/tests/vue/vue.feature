Feature: vue__hello

  Scenario: Initial rendering
    Given I render "Hello.vue"
    Then I should see "Hello world!"

  Scenario: Render with properties
    Given I render "Hello.vue" with the following properties:
      | name | property |
    Then I should see "Hello property!"

  @skip-ci
  Scenario: Name is changed reactively
    Given I render "Hello.vue"
    When for "Name" I enter "reactive variable"
    Then I should see "Hello reactive variable!"
