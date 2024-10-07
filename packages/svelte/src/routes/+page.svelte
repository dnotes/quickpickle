<script lang="ts">
  import GherkinBuilder from '$lib/GherkinBuilder.svelte'
  export let data

</script>

<GherkinBuilder stepDefinitions={data.stepDefinitions}/>