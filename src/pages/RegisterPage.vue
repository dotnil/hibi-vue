<template>
  <h2>Register</h2>

  <RegisterForm :errorMessage="errorMessage" @register="onRegister" />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RegisterForm from '../components/RegisterForm.vue'
import { createUser } from '../api-client/users'

const router = useRouter()
const errorMessage = ref('')

const onRegister = async credentials => {
  errorMessage.value = ''

  try {
    await createUser(credentials)

    await router.push('/login')
  } catch (error) {
    console.error('register failed:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Registration failed'
  }
}
</script>

<style scoped>
h2 {
  margin: 20px;
}
</style>
