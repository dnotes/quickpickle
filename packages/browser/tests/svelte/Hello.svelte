<script lang="ts">

  let {
    name = 'world',
    tag = 'h1',
  }:{
    name?:string
    tag?:string
  } = $props()

</script>

<div>
  <svelte:element this={tag}>Hello {name}!</svelte:element>
  <label>
    <span>Name</span>
    <input type="text" bind:value={name} />
  </label>
</div>

<style>
  div {
    width: 400px;
    margin: 2em auto;
    padding: 1em;
  }
  label>span {
    display: inline-block;
    width: 100px;
  }
</style>