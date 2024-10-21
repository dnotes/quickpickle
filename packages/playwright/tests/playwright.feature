@concurrent
Feature: Basic tests of Playwright browser and steps

  Scenario: Getting a remote page
    Given I go to "https://xkcd.com/2928/"
    Then I should see "Software Testing Day"

  Scenario: Getting a local page
    Given I load the file "tests/examples/example.html"
    Then I should see an "h1" element with text "HTML Test Page"

  Scenario: Clicking on links
    Given I load the file "tests/examples/example.html"
    When I click on the "Form" link
    Then the url should contain "#form"
    When I click on "Message:"
    Then the "textarea" should be focused

  @concurrent
  Rule: Playwright should support testing with multiple browsers

    @chromium
    Example: Running chromium tests
      Then the user agent should be "chromium"

    @firefox @skip-ci
    Example: Running firefox tests
      Then the user agent should be "firefox"

    @webkit @skip-ci
    Example: Running webkit tests
      Then the user agent should be "webkit"

  Rule: It should be possible to set a tag and see the browser with slowMo

    @browser @slowmo @skip-ci
    Example: Opening a page
      When I load the file "tests/examples/example.html"
      Then I should see an "h1" element with text "HTML Test Page"

  @skip-ci @sequential
  Rule: Visual regression testing must be supported

    Example: Passing visual regression test
      When I load the file "tests/examples/simple.html"
      Then the screenshot should match

    Example: Passing named visual regression test
      When I load the file "tests/examples/example.html"
      Then the screenshot "playwright-example" should match

    @fails
    Example: Failing visual regression test
      When I load the file "tests/examples/simple.html"
      Then the file "screenshots/playwright-example.png.diff.png" should not exist
      And the screenshot "playwright-example" should match

    Scenario: Delete the visual regression failure file
      Then the file "screenshots/playwright-example.png.diff.png" should not exist
      And the file "screenshots/playwright-example.png.actual.png" should exist--delete it