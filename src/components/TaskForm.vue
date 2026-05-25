<template>
  <form @submit.prevent='handleSubmit'>
    <input v-model='title' type='text' placeholder='task title'>
    <button type='submit'>save</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { createTask } from '@/backend/tasks.js'

const title = ref('')

const handleSubmit = async () => {
  const taskPayload = {
    title: title.value,
  }

  try {
    const task = await createTask(taskPayload)
    console.log(task)
  } catch (error) {
    console.error(`💩${error}`)
  }
}

</script>

<style scoped>
form {
  display: flex;
}
</style>
