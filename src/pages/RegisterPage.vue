<template>
  <h2>Register</h2>

  <RegisterForm @register="onRegister" />
</template>

<script setup>
import { useRouter } from 'vue-router'
import RegisterForm from '../components/RegisterForm.vue'
import { createUser } from '../api-client/users'

const router = useRouter()

const onRegister = async credentials => {
  try {
    await createUser(credentials)

    await router.push('/login')
  } catch (error) {
    console.error('register failed:', error)
  }
}
</script>
