<template>
  <section class="auth-page">
    <div class="auth-card">
      <h2>Login</h2>
      <LoginForm :errorMessage="errorMessage" @login="onLogin" @formChanged="onFormChanged" />
      <p class="auth-switch">
        Don't have an account? <RouterLink to="/register">Register</RouterLink>
      </p>
      <p class="auth-home-link">
        <RouterLink to="/">Continue without an account</RouterLink>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import { login } from '../api-client/users'

const router = useRouter()
const errorMessage = ref('')

const onFormChanged = () => {
  errorMessage.value = ''
}

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
.auth-page {
  display: grid;
  min-height: 100vh;
  padding: 24px;
  place-items: center;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
}

h2 {
  margin: 0 0 24px;
}

.auth-switch {
  margin-top: 20px;
  color: #6b7280;
  font-size: 14px;
  text-align: center;
}

.auth-switch a {
  color: #4b5563;
  font-weight: 600;
  text-decoration: underline;
}

.auth-switch a:hover {
  color: #111827;
}

.auth-home-link {
  margin-top: 16px;
  font-size: 13px;
  text-align: center;
}

.auth-home-link a {
  color: #9ca3af;
  text-decoration: none;
}

.auth-home-link a:hover {
  color: #6b7280;
  text-decoration: underline;
}
</style>
