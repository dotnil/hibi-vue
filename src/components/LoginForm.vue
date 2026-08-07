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

input {
  flex: 1;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;

  font-size: 16px;

  transition: border-color .2s ease, box-shadow .2s ease;
}

input:focus {
  outline: none;
  border-color: #ddea7c;
  box-shadow: 0 0 0 3px rgba(221, 234, 124, 0.25);
}

input:hover {
  outline: none;
  border-color: #ddea7c;
  box-shadow: 0 0 0 3px rgba(221, 234, 124, 0.25);
}
</style>
