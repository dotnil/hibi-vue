<template>
  <h2>Login</h2>
  <LoginForm @login="onLogin" />
</template>

<script setup>
import { useRouter } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import { login } from '../api-client/users.js'

const router = useRouter()

const onLogin = async credentials => {
  try {
    const result = await login(credentials)

    router.push('/')

} catch (error) {
    console.error(error)
  }
}
</script>
