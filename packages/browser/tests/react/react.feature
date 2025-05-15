Feature: react__hello

  Scenario: Initial rendering
    Given I render "Hello.tsx"
    Then I should see "Hello world!"

  Scenario: Render with properties
    Given I render "Hello.tsx" with the following properties:
      | name | property |
    Then I should see "Hello property!"

  Scenario: Name is changed reactively
    Given I render "Hello.tsx"
    When for "Name" I enter "reactive variable"
    Then I should see "Hello reactive variable!"
