@concurrent
Feature: FAQ pages
  As a curious user
  I want the FAQ page to answer my questions

  Rule: Answers should be HIDDEN by default
    People should have to work for their answers!

    # Gherkin tests are written in Scenarios that test a unit of behavior
    Scenario: I expand a FAQ question to see the answer
      Given I am on "https://docs.astro.build/en/recipes/sharing-state-islands/#why-nano-stores"
      Then I should not see "Nano Stores and Svelte stores are very similar!"
      When I click "How do Svelte stores compare"
      Then I should see "Nano Stores and Svelte stores are very similar!"
      When I click "How do Svelte stores compare"
      Then I should not see "Nano Stores and Svelte stores are very similar!"

    @nojs
    Scenario: FAQ questions expand even without javascript
      Given I am on "https://docs.astro.build/en/recipes/sharing-state-islands/#why-nano-stores"
      Then I should not see "Nano Stores and Svelte stores are very similar!"
      When I click "How do Svelte stores compare"
      Then I should see "Nano Stores and Svelte stores are very similar!"

    @nojs @fails
    Scenario: Not like SOME people's widgets
      Given I am on "https://www.w3.org/WAI/ARIA/apg/patterns/accordion/examples/accordion/"
      Then I should see a "label" with the text "Phone:"
      When I click on the "Personal Information" button
      Then I should not see a "label" with the text "Phone:"
