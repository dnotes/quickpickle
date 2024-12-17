@concurrent
Feature: Actions step definitions on a static page

  As a developer or tester
  I need to be sure that the step definitions work as promised

  Background: Load the example HTML page
    Given I load the file "tests/examples/example.html"

  Rule: Navigation must be supported

    Scenario: navigating forward and backward
      When I load the file "tests/examples/simple.html"
      Then the url should contain "simple.html"
      When I go back
      Then the url should contain "example.html"
      When I go forward
      Then the url should contain "simple.html"

  Rule: Interaction: Clicking must be supported

    Scenario: clicking on exact text
      When I click on "Text"
      Then the url should contain "#text"
      When I click on "Do CSS transitions affect Playwright awaits?"
      And I wait for 1000ms
      Then I should see "AI says:"

    @should-fail
    Scenario: clicking on inexact text FAILS
      When I click on "Do CSS transitions"

    @should-fail
    Scenario: clicking on hidden elements FAILS
      When I click on "Hidden item"

    @should-fail
    Scenario: clicking on invisible elements FAILS
      When I click on "Invisible item"

    Scenario: clicking on elements by css selector
      When I click the 'a[href="#faq"]' element
      Then the url should contain "faq"

    Scenario: clicking on elements by role
      When I click the "Image" link
      Then the url should contain "#image"

  Rule: Interaction: Focusing must be supported

    Scenario: focusing on exact text
      When I focus on "Text"
      Then the "Text" link should be focused

    @should-fail
    Scenario: focusing on hidden elements fails
      When I focus on "Do CSS transitions affect Playwright awaits?"

    @should-fail
    Scenario: focusing on non-selectable elements FAILS
      When I focus on "Item 1"

    @should-fail
    Scenario: focusing on inexact text FAILS
      When I focus on "List"

    Scenario: Focusing on elements by css selector should work
      When I focus the 'a[href="#faq"]' element
      Then the "FAQ" link should be focused

    Scenario: Focusing on elements by role should work
      When I focus the "Image" link
      Then the "Image" link should be focused

  Rule: Typing must be supported

    Scenario: Typing text into a textbox
      When for "name" I type "David Hunt"
      Then the value of "name" should be "David Hunt"
      When for the "name" textbox I type " Sam Ziegler"
      Then the value of the "name" textbox should be "David Hunt Sam Ziegler"

    Scenario: Navigating through links
      When I focus the "Lists" link
      Then the "Lists" link should be focused
      When I type the following keys: Tab Tab
      Then the "Form" link should be focused
      When I type the following keys: Shift+Tab
      Then the "Table" link should be focused

    Scenario: Navigating through form elements
      When I activate the "Name" textbox
      And I type the following keys: Tab Tab
      Then the "Message" textbox should be focused
      When I type the following keys: Shift+Tab
      Then the "Email" textbox should be focused

  Rule: Form entry must be supported

    @should-fail
    Scenario: filling a disabled field FAILS
      When for "From" I enter "anything"

    Scenario: Filling one textbox
      When for "Name" I fill in "David Hunt"
      Then the value of "Name" should be "David Hunt"
      When for "Name" I enter "Sam Ziegler"
      Then the value of "Name" should be "Sam Ziegler"
      When for "Name" I enter ""
      Then the value of "Name" should be ""

    Scenario: Filling a date field
      When for "Date" I fill in "2024-10-21"
      Then the value of "Date" should be "2024-10-21"

    Scenario: Filling a number field
      When for "Number" I enter "9"
      Then the value of "Number" should be "9"

    Scenario: Selecting an option
      When for "Color" I select "Red"
      Then the value of "Color" should be "red"
      When for "Color" I enter "- none -"
      Then the value of "Color" should be ""

    Scenario: Checking and unchecking a checkbox
      When I check "I agree"
      Then the "I agree" checkbox should be checked

    Scenario: Checking a radio button
      When I check "later"
      Then the "later" radio should be checked
      And the "now" radio should be unchecked

    Scenario: Filling a whole form
      When I fill in the following fields:
        | Name | David Hunt |
        | Email | git@github.com |
        | Message | Hope this works! |
        | Date | 2024-11-01 |
        | Number | 493 |
        | Color: | blue |
        | later | true |
        | I agree | no |
      Then the value of "Name" should be "David Hunt"
      And the value of "Email" should contain "git"
      And the value of "Message" should be "Hope this works!"
      And the value of "Date" should be "2024-11-01"
      And the value of "Number" should be "493"
      And the value of "Color" should be "blue"
      And the "later" radio should be checked
      And the "I agree" checkbox should be unchecked

  Rule: Waiting must be supported

    Scenario: waiting for visible/hidden text works
      When I click on "Do CSS transitions affect Playwright awaits?"
      Then I should see "AI says:"
      When I click on "Do CSS transitions affect Playwright awaits?"
      Then I should NOT see "AI says:"

  Rule: Scrolling must be supported

    Scenario: Scrolling the full page
      When I scroll down
      Then the "HTML Test Page" heading should be outside the viewport
      When I scroll up
      Then the "HTML Test Page" heading should be inside the viewport

    @todo
    Scenario: Scrolling a particular div

  Rule: Screenshots must be supported

    Scenario: Taking a default screenshot
      When I take a screenshot
      Then the screenshot "Feature: Actions step definitions on a static page_Taking a default screenshot_01.png" should exist--delete it

    Scenario: Taking a named screenshot
      When I take a screenshot named "pickles"
      Then the screenshot "pickles.png" should exist--delete it

    @nojs @js @sequential
    Scenario: Taking a default screenshot with exploded tags
      When I take a screenshot

    @webkit @mobile @desktop @nojs @js @slowmo @sequential
    Scenario: Taking a screenshot with lots of exploded tags
      When I take a screenshot named "temp"

    @sequential
    Scenario: Cleaning up the screenshots with exploded tags
      Then the screenshot "Feature: Actions step definitions on a static page_Taking a default screenshot with exploded tags (@concurrent,@sequential,@js)_01.png" should exist--delete it
      And the screenshot "Feature: Actions step definitions on a static page_Taking a default screenshot with exploded tags (@concurrent,@sequential,@nojs)_01.png" should exist--delete it
      And the screenshot "temp_(@concurrent,@slowmo,@sequential,@nojs,@webkit,@mobile).png" should exist--delete it
      And the screenshot "temp_(@concurrent,@slowmo,@sequential,@nojs,@webkit,@desktop).png" should exist--delete it
      And the screenshot "temp_(@concurrent,@slowmo,@sequential,@js,@webkit,@mobile).png" should exist--delete it
      And the screenshot "temp_(@concurrent,@slowmo,@sequential,@js,@webkit,@desktop).png" should exist--delete it

  Rule: Different browser sizes must be supported

    Background: load the simple file
      When I load the file "tests/examples/simple.html"

    @mobile
    Scenario: viewport size mobile
      Then the screenshot "viewport-size-mobile" should match

    @tablet
    Scenario: viewport size tablet
      When the browser size is "tablet"
      Then the screenshot "viewport-size-tablet" should match

    @desktop
    Scenario: viewport size desktop
      Then the screenshot "viewport-size-desktop" should match

    Scenario: viewport size widescreen
      When the browser size is widescreen
      Then the screenshot "viewport-size-widescreen" should match

    Scenario: viewport size custom 200x800
      When the browser size is 200 x 800
      Then the screenshot "viewport-size-200x800" should match

    Scenario: viewport size custom 500x800
      When the browser size is 500x800
      Then the screenshot "viewport-size-500x800" should match