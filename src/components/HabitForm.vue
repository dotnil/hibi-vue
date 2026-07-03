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

button {
  height: 44px;
  padding: 0 16px;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  background: transparent;
  color: #6B7280;
  border: 1px solid #E5E7EB;
}

button:hover {
  opacity: 0.9;
  background:  #ddea7c;
}
</style>
