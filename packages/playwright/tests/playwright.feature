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

  @sequential @skip-ci @artifacts-todo
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

    @soft
    Example: Failing visual regression test
      When I load the file "tests/examples/example.html"
      Then the screenshot "visual-regression-simple-page.png.diff.png" should not exist
      And the screenshot "visual-regression-simple-page.png.actual.png" should not exist
      And the screenshot "visual-regression-simple-page" should match
      Then error 1 should contain "expected: w:"
      And clear error 1

    Scenario: Delete the visual regression failure file
      # the diff screenshot should not exist because the images are different sizes, so no diff gets created
      Then the screenshot "visual-regression-simple-page.png.diff.png" should not exist
      And the screenshot "visual-regression-simple-page.png.actual.png" should exist--delete it

  @sequential @skip-ci @artifacts-todo @soft
  Rule: Visual regression testing with different sized images should be supported
    
    Background:
      Given I load the file "tests/examples/simple.html"

    Example: Setting a baseline image
      Given the browser size is 200 x 800
      Then I take a screenshot named "visual-regression-different-sizes"

    Example: Comparing images with different dimensions can pass if maxDiffPercentage is set
      Given the following world config:
        ```yaml
        screenshotOptions:
          maxDiffPercentage: 1
          resizeEnabled: true
        ```
      And the browser size is 200 x 805
      Then the screenshot "visual-regression-different-sizes" should match
    
    Example: Comparing images with different dimensions can pass if maxDiffPixels is set
      Given the following world config:
        ```yaml
        screenshotOptions:
          maxDiffPixels: 1000
          resizeEnabled: true
        ```
      And the browser size is 200 x 805
      Then the screenshot "visual-regression-different-sizes" should match

    Example: Comparing images with different dimensions still fails, but with a diff 
      Given the following world config:
        ```yaml
          screenshotOptions:
            resizeEnabled: true
        ```
      Given the browser size is 200 x 805
      When the screenshot "visual-regression-different-sizes" should match
      Then error 1 should NOT contain "expected: w:"
      And error 1 should contain "Images were too different"
      And clear error 1
      And the screenshot "visual-regression-different-sizes.png.diff.png" should exist--delete it
      And the screenshot "visual-regression-different-sizes.png.actual.png" should exist--delete it

    Example: Ignoring the resized area results in a passing test
      Given the following world config:
        ```yaml
          screenshotOptions:
            resizeEnabled: true
            resizeIgnored: true
        ```
      Given the browser size is 200 x 805
      When the screenshot "visual-regression-different-sizes" should match

  @skip-ci @artifacts-todo
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

    Scenario: Two screenshots with a mask
      Given I load the file "tests/examples/example.html"
      And the following world config:
        ```yaml
        screenshotOptions:
          mask:
            - form
        ```
      When I take a screenshot named "mask"
      And I take a screenshot named "mask"
      Then the screenshot "mask.png" should exist--delete it


  Rule: Screenshots should be placed in the proper directory

    Scenario: Taking a screenshot
      When I take a screenshot
      Then the screenshot "Feature Basic tests of Playwright browser and steps_Taking a screenshot_01.png" should exist--delete it

    Scenario: Taking a named screenshot
      When I take a screenshot named "test"
      Then the screenshot "test.png" should exist--delete it

    Scenario: Taking a screenshot of an element
      Given I load the file "tests/examples/example.html"
      When I take a screenshot of the "Image" link
      Then the screenshot "Feature Basic tests of Playwright browser and steps_Taking a screenshot of an element_02.png" should exist--delete it

    Scenario: Taking a named screenshot of an element
      Given I load the file "tests/examples/example.html"
      When I take a screenshot of the "XKCD Comic" img named "test2"
      Then the screenshot "test2.png" should exist--delete it

    Scenario: Scenario with / slash in the name does not create a directory
      Given I take a screenshot
      Then the screenshot "Feature Basic tests of Playwright browser and steps_Scenario with   slash in the name does not create a directory_01.png" should exist--delete it

    Scenario: Scenario with /../../../ traversal in the name does not escape the directory
      Given I take a screenshot
      Then the screenshot "Feature Basic tests of Playwright browser and steps_Scenario with  .. .. ..  traversal in the name does not escape the directory_01.png" should exist--delete it

    Scenario: Named screenshot with / slash in the name creates a directory
      Given I take a screenshot named "test/slash"
      Then the screenshot "test/slash.png" should exist--delete it

    Scenario: Named screenshot with /../../../ traversal in the name does not escape the screenshot directory
      Given I take a screenshot named "test/../../../traversal"
      Then the screenshot "traversal.png" should exist--delete it

  Rule: Playwright timeouts must be supported

    Background:
      Given the following world config:
        ```yaml
          defaultTimeout: 1000
          actionTimeout: 2000
          navigationTimeout: 3000
        ```
      Given I am a user "new"
      When I load the file "tests/examples/example.html"

    @soft
    Scenario: Action takes too long
      When I click on the "Not a link!" link
      Then error 1 should contain "2000ms"
      And clear error 1

    @soft @chromium
    Scenario: Navigation takes too long
      Given the network latency is 4000ms
      When I visit "https://xkcd.com/2928/"
      Then error 1 should contain "3000ms"
      And clear error 1

  Rule: Dark mode should be supported

    @dark
    Scenario: Dark mode should be enabled
      Given I load the file "tests/examples/simple.html"
      Then the screenshot should match
