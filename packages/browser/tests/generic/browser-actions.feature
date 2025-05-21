Feature: Actions step definitions in Vitest Browser

  As a developer or tester
  I need to be sure that the step definitions work as promised

  Background: Load the example HTML page
    Given I render the "Example" component

  Rule: Interaction: Clicking must be supported

    Scenario: clicking on exact text
      When I click on "Text"
      Then "Text" should have been clicked
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

    @todo
    Scenario: clicking on elements by css selector
      When I click the 'a[href="#faq"]' element
      Then the url should contain "faq"

    Scenario: clicking on elements by role
      When I click the "Image" link
      Then the "Image" link should have been clicked

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

    @todo
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
      When I type the following keys: {Shift>} Tab {/Shift}
      Then the "Table" link should be focused

    Scenario: Navigating through form elements
      When I activate the "Name" textbox
      And I type the following keys: Tab Tab
      Then the "Message" textbox should be focused
      When I type the following keys: {Shift>} Tab {Shift}
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
      Then the value of "Number" should be 9

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
      And the value of "Number" should be 493
      And the value of "Color" should be "blue"
      And the "later" radio should be checked
      And the "I agree" checkbox should be unchecked

  Rule: Waiting must be supported

    Scenario: waiting for visible text works ONLY if the animation starts immediately
      When I click on "Do CSS transitions affect Playwright awaits?"
      Then I should see "AI says:"

    @fails
    Scenario: waiting for invisible text DOES NOT WORK
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
      Then the screenshot "Feature Actions step definitions in Vitest Browser_Taking a default screenshot_01.png" should exist--delete it

    Scenario: Taking a named screenshot
      When I take a screenshot named "pickles"
      Then the screenshot "pickles.png" should exist--delete it

    @tag1 @tag2 @sequential
    Scenario: Taking a default screenshot with exploded tags
      When I take a screenshot

    @tag1 @tag2 @sequential
    Scenario: Taking a named screenshot with exploded tags
      When I take a screenshot named "temp"

    @sequential
    Scenario: Cleaning up the screenshots with exploded tags
      Then the screenshot "Feature Actions step definitions in Vitest Browser_Taking a default screenshot with exploded tags (sequential,tag1)_01.png" should exist--delete it
      And the screenshot "Feature Actions step definitions in Vitest Browser_Taking a default screenshot with exploded tags (sequential,tag2)_01.png" should exist--delete it

    @sequential @skip-ci
    Scenario: Cleaning up the screenshots with exploded tags
      And the screenshot "temp_(sequential,tag1).png" should exist--delete it
      And the screenshot "temp_(sequential,tag2).png" should exist--delete it
