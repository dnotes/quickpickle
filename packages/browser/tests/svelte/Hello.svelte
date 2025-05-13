<script lang="ts">

  let {
    name = 'world',
  }:{
    name:string
  } = $props()

</script>

<div>
  <h1>Hello {name}!</h1>
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