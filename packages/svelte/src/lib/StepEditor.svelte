<script lang="ts">
import DataTable from "./DataTable.svelte";
import type { StepDefinition, StepParameter, StepPart } from "./helpers.js";

  export let stepDefinitions:StepDefinition[]
  export let step:StepDefinition|null = null

  let text:string = ''                // The part of the pattern that the user has already typed
  let unmatched:string = ''           // The user's typed text that doesn't match the next part of the pattern
  let upcoming:string = ''            // The part of the pattern that the user hasn't yet typed
  let editing:StepPart|undefined      // The part that the user is currently editing

  let el:HTMLInputElement             // The text input
  let offsetWidth:number = 0          // The width that the text input should be

  let selectedStep:null|number = null

  $: availableSteps = stepDefinitions.filter(s => s.matcher.test(text))

  function pickStep(chosenStep:StepDefinition) {
    step = {...chosenStep}
    parseText(true)
  }

  function handleKey(e:KeyboardEvent){

    // Movement
    if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault()
      if (!step) {
        if (!selectedStep) selectedStep = 0
        if (selectedStep !== null) pickStep(availableSteps[selectedStep])
      }
      else {
        parseText(true)
      }
    }
    else if (e.key === 'ArrowDown') {
      selectedStep = (selectedStep === null || selectedStep === availableSteps.length) ? 0 : selectedStep + 1
      e.preventDefault()
    }
    else if (e.key === 'ArrowUp') {
      selectedStep = (selectedStep === null || selectedStep === 0) ? availableSteps.length - 1 : selectedStep - 1
      e.preventDefault()
    }
    else {
      selectedStep = null
    }

    // Typing
    if (editing?.idx === 'text' && step) {
      if (e.key !== upcoming.charAt(0)) e.preventDefault()
    }
    else if (typeof editing?.idx === 'number') {
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        let str = unmatched + e.key
        if (editing.type === 'options' && !editing.options?.filter(o => o.startsWith(str))?.length) e.preventDefault()
      }
    }

  }

  function handleInput() {
    if (typeof editing?.idx === 'number') {
      parseText()
    }
  }

  function parseText(autocomplete=false) {
    let textcopy = text
    let matchedtext = ''
    upcoming = ''
    unmatched = ''
    step?.parts.forEach((part,i) => {
      let match = (textcopy.match(part.matcher) || [''])[0]
      if (match) {
        matchedtext += match
        textcopy = textcopy.replace(match, '')
        if (part.idx !== 'text') step!.params[part.idx].value = match
      }
      else if (part.idx === 'text' && autocomplete) {
        let nextParam = step!.params.find(s => s.idx === step!.parts[i+1]?.idx)
        matchedtext += part.type
        if (nextParam?.type === 'string' && !matchedtext.match(/['"]$/)) matchedtext += '"'
        editing = step?.parts[i+1]
        text = matchedtext
        textcopy = ''
        autocomplete = false
      }
      else if (editing === part && typeof part.idx === 'number' && part.type === 'options' && autocomplete) {
        let option = part.options?.filter(t => t.startsWith(textcopy))[0]
        matchedtext += option
        text = matchedtext
        textcopy = ''
        editing = step?.parts[i+1]
      }
      else if (editing === part) {
        // set the upcoming text
        if (part.idx === 'text') upcoming += part.type
        // or else set the proper parameter
        else if (part.type !== 'options') step!.params[part.idx].value = textcopy

        if (part.type === 'string') upcoming += '"'
        else if (part.type === 'options') upcoming += part.options?.filter(t => !textcopy || t.startsWith(textcopy)).join('/') || ''
      }
      else {
        if (part.idx === 'text') upcoming += part.type
        else if (step!.params[part.idx].type === 'string') upcoming += '"{string}"'
        else if (step!.params[part.idx].type === 'options') upcoming += step!.params[part.idx].source.replace(/\|/g, '/')
        else upcoming += '{' + part.type + '}'
      }
    })
    unmatched = textcopy
    upcoming = upcoming.replace(unmatched, '')
  }

  let bigtext:StepParameter|null|undefined
  $: bigtext = step?.params.find(s => s.type === 'bigstring' || s.type === 'datatable')

</script>

<div class="quickpickle-stepbuilder">
  <label class="step-editor">
    <input
      type="text"
      bind:value={text}
      on:keydown={handleKey}
      on:input={handleInput}
      bind:this={el}
      style="width:{offsetWidth + 2}px;"
    >
    <span class="upcoming">{text ? upcoming : 'what is the next step'}</span>
  </label>
  <span bind:offsetWidth class="input-sizer">{text}</span>

  {#if !step}
    <div class="steps">
      {#each availableSteps as step, stepIndex}
        <div class="step" role="button" tabindex="0"
          on:click={() => pickStep(step)}
          on:keydown={(event) => event.key === 'Enter' && pickStep(step)}
          class:selected={stepIndex === selectedStep}>
          {step.label}
        </div>
      {/each}
    </div>
  {/if}

  {#if step}
    <div class="params">
      {#each step.params.filter(s => s.type !== 'bigstring' && s.type !== 'datatable') as param,i}
        <div class="param">
          <span class="param-name">{param.name}:</span>
          <span class="param-value">{step.params[i].value}</span>
        </div>
      {/each}
      {#if bigtext}
        <textarea placeholder="parameter value" bind:value={bigtext.value} class:hidden={bigtext.type === 'datatable'}></textarea>
        {#if bigtext.type === 'datatable'}
          <DataTable bind:value={bigtext.value} />
        {/if}
      {/if}
    </div>
  {/if}

</div>

<style>
  :global().quickpickle-stepbuilder {
    --quickpickle-selected-color:lightskyblue;
    --quickpickle-highlight-color:green;
    --quickpickle-faded-color:gray;
    --quickpickle-font-size:16px;
    --quickpickle-font-family:Arial sans-serif;
    --quickpickle-danger-color:rgba(242, 76, 25, 0.839);
  }
  .hidden { display: none; }
  .selected { background-color:var(--quickpickle-selected-color); }
  .upcoming { color:var(--quickpickle-faded-color); font-size:var(--quickpickle-font-size); }
  .step-editor {
    border: 1px solid var(--quickpickle-faded-color);
    border-radius: 3px;
    padding: 2px;
    display:block;
  }
  .input-sizer {
    position: absolute;
    height: 0;
    overflow: hidden;
    white-space: pre;
    font-size: var(--quickpickle-font-size);
    font-family: var(--quickpickle-font-family);
  }
  input {
    font-size: var(--quickpickle-font-size);
    font-family: var(--quickpickle-font-family);
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    width: auto;
    box-sizing: content-box;
    background: transparent;
  }
  div.step { cursor: pointer;}
  .param-value { font-weight:bold; color:var(--quickpickle-highlight-color); }
</style>