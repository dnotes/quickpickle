@todo
Feature: Basic tests of Vitest Browser Mode and steps

  @skip-ci
  Rule: Visual regression testing must be supported

    Example: Passing visual regression test
      When I render the "Example" component
      Then the screenshot should match

    Example: Passing named visual regression test
      When I render the "Example" component
      Then the screenshot "visual-regression-example-page" should match

    Example: Passing visual regression test of an element
      When I render the "Example" component
      Then the screenshot of the "XKCD Comic" img should match

    Example: Passing named visual regression test of an element
      When I render the "Example" component
      Then the screenshot "visual-regression-faq-section" of the "#faq" element should match

    @fails
    Example: Failing visual regression test
      When I render the "Example" component
      Then the screenshot "visual-regression-simple-page.png.diff.png" should not exist
      And the screenshot "visual-regression-simple-page.png.actual.png" should not exist
      And the screenshot "visual-regression-simple-page" should match

    Scenario: Delete the visual regression failure file
      Then the screenshot "visual-regression-simple-page.png.diff.png" should not exist
      And the screenshot "visual-regression-simple-page.png.actual.png" should exist--delete it

  @todo
  Rule: Setting screenshot options must be supported

    Scenario: Setting a screenshot mask
      Given I render the "Example" component
      And the following world config:
        ```yaml
        screenshotOptions:
          mask:
            - form
        ```
      Then the screenshot should match

    Scenario: Setting a clip area
      Given I render the "Example" component
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

  Rule: Screenshots should be placed in the proper directory

    Scenario: Taking a screenshot
      When I take a screenshot
      Then the screenshot "Feature Basic tests of Vitest Browser Mode and steps_Taking a screenshot_01.png" should exist--delete it

    Scenario: Taking a named screenshot
      When I take a screenshot named "test"
      Then the screenshot "test.png" should exist--delete it

    Scenario: Taking a screenshot of an element
      Given I load the file "tests/examples/example.html"
      When I take a screenshot of the "Image" link
      Then the screenshot "Feature Basic tests of Vitest Browser Mode and steps_Taking a screenshot of an element_02.png" should exist--delete it

    Scenario: Taking a named screenshot of an element
      Given I load the file "tests/examples/example.html"
      When I take a screenshot of the "XKCD Comic" img named "test2"
      Then the screenshot "test2.png" should exist--delete it

