@concurrent
Feature: Outcome step definitions on a static page

  As a developer or tester
  I need to be sure that the step definitions work as promised

  Background: Load the example HTML page
    Given I load the file "tests/examples/example.html"

  Scenario: test if text is visible when a single element matches
    Then I should see "Item 1"
    And the text "Item 1" should be visible

  Scenario: test if text is visible when multiple elements match
    Then I should see "Image"
    And the text "Image" should be visible

  Scenario: test that text is not visible
    Then I should not see "FWAH!!!"
    And the text "FWAH!!!" should not be visible

  Scenario: test that elements are visible with name and role
    Then I should see an "Email:" textbox
    And I should see a "Form" heading

  Scenario: test that elements are visible with inexact name and role
    Then I should see an "orm" heading

  Scenario: test that elements are not visible
    Then I should not see a "FWAH!!!" textbox
    And I should not see a "Form" notheading

  Scenario: test that an element hidden with display:none is not visible
    Then I should not see "Hidden item"

  Scenario: test that an element hidden with visibility:hidden is not visible
    Then I should not see "Invisible item"

  Scenario: test that elements matching text are visible
    Then I should see an "h1" element with the text "HTML Test Page"
    And I should see an "li" with the text "First item"

  Scenario: test that elements matching text are not visible
    Then I should NOT see an "h1" element with the text "FWAH!!!"
    And I should NOT see a "fwah" element with the text "FWEEE!!!"

  Rule: All of the ways of addressing an element should be tested

    Example: it works to address an element with css selector but no role (or the word "element")
      Then a "textarea#message" should be visible
      And the "li.hidden" should be hidden
      And an 'input[type="submit"]' element should be visible

    @fails
    Example: it FAILS to address an element with a css selector AND a role
      Then a "li.hidden" listitem should be hidden

    Example: it works to address an element with name and role
      Then an "XKCD Comic" img should be visible
      And a "message" textbox should be visible
      And a "lists" link should be visible

    @fails
    Example: it FAILS to address an element with name and role IF the element is hidden
      And a "Hidden item" listitem should be hidden

    Example: it works to address an element with css selector and text
      Then the "li.hidden" with the text "Hidden item" should be hidden
      And the 'a[href="https://xkcd.com/2928"]' element with the text "2928" should be visible

  Rule: Testing for invisible elements should be possible

    Scenario: "I should not see" does not ensure presence of invisible elements
      Then I should not see an "li.absent" with the text "nothing"

    Scenario: "the {string} should be hidden" passes when elements are present and invisible
      Then the "li.hidden" element should be invisible

    @fails
    Scenario: "the {string} should be hidden" FAILS when elements are not present
      Then the "li.imaginary" should be invisible

  Rule: Testing for disabled / enabled state should be possible

    Scenario: test that elements are disabled
      Then the "From" textbox should be disabled

    Scenario: test that elements are enabled
      Then the "Email" textbox should be enabled

  Rule: Testing for checked / unchecked state should be possible

    Scenario: Checking a checkbox
      Then the "I agree" checkbox should be unchecked
      When I click the "I agree" checkbox
      Then the "I agree" checkbox should be checked

    Scenario: Checking a radio button
      Then the "now" radio should be checked
      When I click the "later" radio
      Then the "now" radio should be unchecked
      And the "later" radio should be checked

  Rule: Testing for focused / unfocused state should be possible

    Scenario: navigating through the form
      When I click the "Name" textbox
      Then the "Name" textbox should be focused
      When I activate the "Email" textbox
      Then the "Name" textbox should be blurred
      And the "Email" textbox should be focused
      When I type the following keys: Tab
      Then the "Email" textbox should be blurred
      And the "Message" textbox should be focused

  Rule: Testing for form input values should be possible

    Scenario: default values should be available
      Then the value of the "From" textbox should be "example@example.com"
      And the value of the "From" textbox should contain "example"
      And the value of the "From" textbox should not include "FWAH!"
      And the value of the "From" textbox should NOT be "example"
      And the value of "From" should contain "example"
      And the value of "From" should NOT be "example"

    Scenario: date values
      Then the value of the "Date" textbox should be "2024-10-19"
      When I focus on the "Date" textbox
      And I type the following keys: ArrowLeft ArrowLeft ArrowLeft ArrowUp
      Then the value of the "Date" textbox should be "2024-11-19"

  Rule: Testing for metatags should be possible

    Scenario: testing the page title
      Then the metatag "title" should be "HTML Test Page"
      And the metatag "title" should not contain "FWAH!"
      Then the "title" metatag should be "HTML Test Page"
      And the "title" metatag should not contain "FWAH!"

    Scenario: testing the meta:viewport
      Then the meta tag "viewport" should contain "width=device-width"
      And the meta tag "viewport" should NOT be "width=device-width"
      Then the "viewport" metatag should contain "width=device-width"
      And the "viewport" metatag should NOT be "width=device-width"
