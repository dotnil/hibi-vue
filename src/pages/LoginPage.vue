<template>
  <h2>Login</h2>
  <LoginForm :errorMessage="errorMessage" @login="onLogin" />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import { login } from '../api-client/users'

const router = useRouter()
const errorMessage = ref('')

const onLogin = async credentials => {
  errorMessage.value = ''

  try {
    const result = await login(credentials)

    if (!result || result.error) {
      throw new Error(result?.error || 'Login failed')
    }

    await router.push('/')
  } catch (error) {
    console.error('login failed:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Login failed'
  }
}
</script>

<style scoped>
h2 {
  margin: 20px;
}
</style>
