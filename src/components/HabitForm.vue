<template>
  <form @submit.prevent='handleSubmit'>
    <input v-model='name' type='text' placeholder='habit name'>
    <button type='submit'>save</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['habitCreated'])

const name = ref('')

const handleSubmit = () => {
  const habit = {
    name: name.value,
    active: true
  }

  emit('habitCreated', habit)

  name.value = ''
}
</script>

<style scoped>
form {
  display: flex;
  margin: 20px;
}
</style>
