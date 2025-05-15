<template>
  <div>
    <h1>Hello {{ nameValue }}!</h1>
    <label>
      <span>Name</span>
      <input type="text" v-model="nameValue" />
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  name?: string
}>()

const nameValue = ref(props.name ?? 'world')
</script>

<style>
div {
  width: 400px;
  margin: 2em auto;
  padding: 1em;
}
label > span {
  display: inline-block;
  width: 100px;
}
</style>