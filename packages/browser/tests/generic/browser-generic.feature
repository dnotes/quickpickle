Feature: Basic tests of Vitest Browser Mode and steps

  Background:
    Given I render the "Example" component

  @skip-ci
  Rule: Visual regression testing must be supported

    Example: Passing visual regression test
      Then the screenshot should match

    Example: Passing named visual regression test
      Then the screenshot "visual-regression-example-page" should match

    Example: Passing visual regression test of an element
      Then the screenshot of the "XKCD Comic" img should match

    @todo
    Example: Passing named visual regression test of an element
      Then the screenshot "visual-regression-faq-section" of the "#faq" element should match

    @soft
    Example: Failing visual regression test
      When I take a screenshot of the "Image" link named "made-to-fail"
      And I take a screenshot of the "FAQ" link named "faq"
      Then the screenshot "made-to-fail.png.diff.png" should not exist
      And the screenshot "made-to-fail.png.actual.png" should not exist
      And the screenshot "made-to-fail" of the "FAQ" link should match
      Then the screenshot "made-to-fail.png.diff.png" should not exist
      And the screenshot "made-to-fail.png.actual.png" should exist--delete it
      And the screenshot "faq.png" should exist--delete it
      And the screenshot "made-to-fail.png" should exist--delete it
      Then there should have been 1 error

  @todo
  Rule: Setting screenshot options must be supported

    Scenario: Setting a screenshot mask
      And the following world config:
        ```yaml
        screenshotOptions:
          mask:
            - form
        ```
      Then the screenshot should match

    Scenario: Setting a clip area
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
      When I take a screenshot of the "Image" link
      Then the screenshot "Feature Basic tests of Vitest Browser Mode and steps_Taking a screenshot of an element_01.png" should exist--delete it

    Scenario: Taking a named screenshot of an element
      When I take a screenshot of the "XKCD Comic" img named "test2"
      Then the screenshot "test2.png" should exist--delete it

