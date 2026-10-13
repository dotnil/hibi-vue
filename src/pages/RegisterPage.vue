<template>
  <section class="auth-page">
    <div class="auth-card">
      <h2>Register</h2>
      <RegisterForm :errorMessage="errorMessage" @register="onRegister" @formChanged="onFormChanged" />
      <p class="auth-switch">
        Already have an account? <RouterLink to="/login">Login</RouterLink>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RegisterForm from '../components/RegisterForm.vue'
import { createUser } from '../api-client/users'

const router = useRouter()
const errorMessage = ref('')

const onFormChanged = () => {
  errorMessage.value = ''
}

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
</style>
