Feature: QuickPickle Playwright CommonJS

  Scenario: QuickPickle Playwright works in CommonJS
    Given I load the file "tests/test.html"
    Then I should see a "Test CommonJS" heading