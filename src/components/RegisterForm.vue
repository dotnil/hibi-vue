<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="email" type="email" placeholder="email">
    <input v-model="password" type="password" placeholder="password">

    <button type="submit">
      register
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['register'])

const email = ref('')
const password = ref('')

const handleSubmit = () => {
  emit('register', {
    email: email.value,
    password: password.value,
  })

  email.value = ''
  password.value = ''
}
</script>

<style scoped>
form {
  display: flex;
  margin: 20px;
}
</style>
