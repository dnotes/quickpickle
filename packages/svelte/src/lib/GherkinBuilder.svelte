<script lang="ts">
  import type { StepDefinition } from "./helpers.js";
  import StepEditor from "./StepEditor.svelte";

  export let stepDefinitions:StepDefinition[]
  export let requiredSteps:string[] = []

  let steps:StepDefinition|null[] = [null]

</script>

<form>

  <label>
    <span>Scenario:</span>
    <input type="text" name="scenario" id="scenario" placeholder="briefly describe what you are trying to do">
  </label>

  {#if stepDefinitions?.length}
    <div class="steps">
      {#each steps as step}
        <StepEditor bind:step {stepDefinitions} />
      {/each}
    </div>
  {:else}
    <p>No step definitions found. Please add some step definitions to the <code>stepDefinitions</code> variable in <code>src/lib/GherkinBuilder.svelte</code>.</p>
  {/if}

</form>
