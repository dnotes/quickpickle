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
    Then the "textarea" element should be focused

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
      When I load the file "tests/examples/simple.html"
      Then the screenshot "visual-regression-simple-page" should match

    Example: Passing visual regression test of an element
      When I load the file "tests/examples/example.html"
      Then the screenshot of the "XKCD Comic" img should match

    Example: Passing named visual regression test of an element
      When I load the file "tests/examples/example.html"
      Then the screenshot "visual-regression-faq-section" of the "#faq" element should match

    @fails
    Example: Failing visual regression test
      When I load the file "tests/examples/example.html"
      Then the file "screenshots/visual-regression-simple-page.png.diff.png" should not exist
      And the file "screenshots/visual-regression-simple-page.png.actual.png" should not exist
      And the screenshot "visual-regression-simple-page" should match

    Scenario: Delete the visual regression failure file
      Then the file "screenshots/visual-regression-simple-page.png.diff.png" should not exist
      And the file "screenshots/visual-regression-simple-page.png.actual.png" should exist--delete it

  Rule: Setting screenshot options must be supported

    Scenario: Setting a screenshot mask
      Given I load the file "tests/examples/example.html"
      And the following world config:
        ```yaml
        screenshotOptions:
          mask:
            - form
        ```
      Then the screenshot should match

    Scenario: Setting a clip area
      Given I load the file "tests/examples/example.html"
      And the following world config:
        ```yaml
          screenshotOptions:
            clip:
              x: 0
              y: 60
              width: 300
              height: 180
        ```
      Then the screenshot should match

  @skip-ci
  Rule: Screenshots should be placed in the proper directory

    Scenario: Taking a screenshot
      When I take a screenshot
      Then the file "screenshots/Feature: Basic tests of Playwright browser and steps_Taking a screenshot_01.png" should exist--delete it

    Scenario: Taking a named screenshot
      When I take a screenshot named "test"
      Then the file "screenshots/test.png" should exist--delete it

    Scenario: Taking a screenshot of an element
      Given I load the file "tests/examples/example.html"
      When I take a screenshot of the "Image" link
      Then the file "screenshots/Feature: Basic tests of Playwright browser and steps_Taking a screenshot of an element_02.png" should exist--delete it

    Scenario: Taking a named screenshot of an element
      Given I load the file "tests/examples/example.html"
      When I take a screenshot of the "XKCD Comic" img named "test2"
      Then the file "screenshots/test2.png" should exist--delete it

