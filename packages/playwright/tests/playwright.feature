@concurrent
Feature: Basic tests of Playwright browser and steps

  Scenario: I can go to a page
    Given I go to "http://acid3.acidtests.org/"
    Then I should see "Acid3"

  Scenario: Getting another page should support concurrency
    Given I go to "https://xkcd.com/2928/"
    Then I should see "Software Testing Day"