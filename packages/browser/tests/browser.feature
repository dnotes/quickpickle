Feature: Vitest in "browser" mode

  Scenario: Can we run Vitest in "browser" mode?
    Given I go to "./browser.test.html"
    Then I should see "Acid3"