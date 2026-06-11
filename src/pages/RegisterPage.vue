<template>
  <h2>Register</h2>

    <RegisterForm @register="onRegister" />
</template>

<script setup>
import RegisterForm from '../components/RegisterForm.vue'
import { createUser } from '../api-client/users.js'

const onRegister = async credentials => {
  try {
    const user = await createUser(credentials)

    console.log('🐖 mr.Hryak registered')
    console.log(user)

  } catch (error) {
    console.error(error)
  }
}
</script>
