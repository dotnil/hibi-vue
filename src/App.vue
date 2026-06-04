<template>
  <main>
    <h1>hibi</h1>

    <RegisterForm @register="onRegister" />
    <LoginForm @login="onLogin" />

    <HabitForm @habitCreated="onHabitCreated" />
    <HabitList
      :habits="habits"
      @habitDeleted="onHabitDeleted"
      @habitUpdated="onHabitUpdated"
    />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import HabitForm from './components/HabitForm.vue'
import HabitList from './components/HabitList.vue'
import RegisterForm from './components/RegisterForm.vue'
import LoginForm from './components/LoginForm.vue'

import { createUser, login } from './api-client/users.js'
import { createHabit, list, updateHabit, deleteHabit } from './api-client/habits.js'

const habits = ref([])
const editingHabit = ref(null)
const editingName = ref('')

const loadHabits = async () => habits.value = await list()

onMounted(async () => {
  await loadHabits()
})

const onRegister = async credentials => {
  try {
    const user = await createUser(credentials)

    console.log('🐖 mr.Hryak registered')
    console.log(user)

  } catch (error) {
    console.error(error)
  }
}

const onLogin = async credentials => {
  try {
    const result = await login(credentials)

    console.log('🐖 mr.Hryak logged in')
    console.log(result)

    await loadHabits()

  } catch (error) {
    console.error(error)
  }
}

const onHabitCreated = async (habit) => {
  console.log('🐖 habitCreated')

  try {
    await createHabit(habit)

    await loadHabits()

  } catch (error) {
    console.error('DB error:', error)
  }
}

const onHabitUpdated = async (habit) => {
  console.log('✏️ received update event')
  console.log(habit)

  try {
    await updateHabit(habit)

    await loadHabits()

  } catch (error) {
    console.error('update failed:', error)
  }
}

const onHabitDeleted = async (habit) => {
  console.log('🐖💨🗑️ habitDeleted')

  try {
    await deleteHabit(habit.id)

    await loadHabits()

  } catch (error) {
    console.error(error)
  }
}
</script>
