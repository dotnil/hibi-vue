<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="email" type="email" placeholder="email">
    <input v-model="password" type="password" placeholder="password">

    <button type="submit">
      login
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login'])

const email = ref('')
const password = ref('')

const handleSubmit = () => {
  emit('login', {
    email: email.value,
    password: password.value,
  })
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
  background: #ddea7c;
}
</style>
