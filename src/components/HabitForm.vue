<template>
  <form @submit.prevent='handleSubmit'>
    <input v-model='title' type='text' placeholder='habit title'>
    <button type='submit'>save</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { createHabit } from '@/backend/habits.js'

const title = ref('')

const handleSubmit = async () => {
  const habitPayload = {
    title: title.value,
    status: true
  }

  try {
    const habit = await createHabit(habitPayload)
    console.log(habit)
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
