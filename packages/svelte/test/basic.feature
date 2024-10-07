Feature: Basic testing for the svelte component

Scenario: It renders.
  Given the following step definition file:
    """
    Given('the following step definition file:', async function (this:DomWorldInterface, text) {
      this.data.stepDefinitions = getSteps(text)
    })

    Given('the following required steps:', async function (this:DomWorldInterface, text) {
      this.data.requiredSteps = text.split('/n')
    })

    When('I render the GherkinBuilder component', async function (this:DomWorldInterface) {
      this.data.gherkinBuilder = render(GherkinBuilder, {
        props: {
          stepDefinitions: this.data.stepDefinitions,
          requiredSteps: this.data.requiredSteps
        }
      })
    })
    """
  When I render the GherkinBuilder component
  Then I should see "Scenario:"
  And I should see "the following step definition file:"