<template>
  <h2>Login</h2>
  <LoginForm @login="onLogin" />
</template>

<script setup>
import { useRouter } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import { login } from '../api-client/users'

const router = useRouter()

const onLogin = async credentials => {
  try {
    const result = await login(credentials)

    if (!result || result.error) {
      throw new Error(result?.error || 'Login failed')
    }

    await router.push('/')
  } catch (error) {
    console.error('login failed:', error)
  }
}
</script>

<style scoped>
h2 {
  margin: 20px;
}
</style>
