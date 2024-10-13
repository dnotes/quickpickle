@concurrent
Feature: Basic tests of Playwright browser and steps

  Scenario: I can get a page on the internet
    Given I go to "https://xkcd.com/2928/"
    Then I should see "Software Testing Day"

  Scenario: I can get a page locally
    Given I load the file "tests/examples/example.html"
    Then I should see an "h1" element with text "HTML Test Page"

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

    Example: Passing visual regression test
      When I load the file "tests/examples/example.html"
      Then the screenshot "playwright-example" should match

    @fails
    Example: Failing visual regression test
      When I load the file "tests/examples/simple.html"
      Then the screenshot "playwright-example" should match