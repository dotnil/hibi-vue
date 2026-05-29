<template>
  <main>
    <h1>hibi</h1>

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

import { createHabit, list, updateHabit, deleteHabit } from './api-client/habits.js'

const habits = ref([])
const editingHabit = ref(null)
const editingName = ref('')

const loadHabits = async () => habits.value = await list()

onMounted(async () => {
  await loadHabits()
})

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
  console.log('✏️')
  console.log(habit)

  habit.name = 'new name'

  try {
    await updateHabit(habit)

    await loadHabits()

  } catch (error) {
    console.error(error)
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
