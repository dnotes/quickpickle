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
    Then the active element should be a "textarea"

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

  Rule: Visual regression testing must be supported

    @skip-ci
    Example: Passing visual regression test
      When I load the file "tests/examples/example.html"
      Then the screenshot "playwright-example" should match

    @fails
    Example: Failing visual regression test
      When I load the file "tests/examples/simple.html"
      Then the screenshot "playwright-example" should match