Feature: Basic tests of Vitest Browser Mode and steps

  Background:
    Given I render the "Example" component

  Rule: Visual regression testing must be supported

    @soft
    Example: New visual regression test
      Given the screenshot "example" does not exist
      When the screenshot "example" should match
      Then the screenshot "example" should exist--delete it
      And there should have been 1 error

    Example: Passing visual regression test
      Given the screenshot should match

    Example: Passing named visual regression test
      Then the screenshot "visual-regression-example-page" should match

    Example: Passing visual regression test of an element
      Then the screenshot of the "XKCD Comic" img should match

    @todo
    Example: Passing named visual regression test of an element
      Then the screenshot "visual-regression-faq-section" of the "#faq" element should match

    @soft
    Example: Failing visual regression test (different image content)
      Given the screenshot "visual-regression-example-page" should exist
      When headings have a green background
      And the screenshot "visual-regression-example-page" should match
      Then error 1 should contain "images were too different"
      And there should have been 1 error

    @soft
    Example: Failing visual regression test (different image size)
      Given the screenshot "visual-regression-example-page" should exist
      When the screenshot "visual-regression-example-page" of the "Image" header should match
      Then error 1 should contain "sizes do not match"
      And there should have been 1 error
