<template>
  <HabitForm @habitCreated="onHabitCreated" />

  <HabitList
    :habits="habits"
    @habitDeleted="onHabitDeleted"
    @habitUpdated="onHabitUpdated"
  />
  <div class='logged' v-if="currentUser">
    <p>logged in as: {{ currentUser.email }}</p>
    <button @click="onLogout">logout</button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { logout } from '../api-client/users'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

import { getCurrentUser } from '../api-client/users'
import { createHabit, list, updateHabit, deleteHabit } from '../api-client/habits.js'

import HabitForm from '../components/HabitForm.vue'
import HabitList from '../components/HabitList.vue'

const habits = ref([])
const currentUser = ref(null)

const route = useRoute()
const router = useRouter()

const loadHabits = async () => {
  habits.value = await list()
}

const loadUser = async () => {
  currentUser.value = await getCurrentUser()
}

onMounted(async () => {
  await loadHabits()
  await loadUser()
})

watch(
  () => route.fullPath,
  async () => {
    await loadUser()
  }
)

const onLogout = async () => {
  try {
    await logout()
    currentUser.value = null
    await router.push('/login')
  } catch (error) {
    console.error(error)
  }
}
const onHabitCreated = async (habit) => {
  try {
    await createHabit(habit)
    await loadHabits()
  } catch (error) {
    console.error('DB error:', error)
  }
}

const onHabitUpdated = async (habit) => {
  try {
    await updateHabit(habit)
    await loadHabits()
  } catch (error) {
    console.error('update failed:', error)
  }
}

const onHabitDeleted = async (habit) => {
  try {
    await deleteHabit(habit.id)
    await loadHabits()
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
.logged {
  margin: 20px;
  display: flex;
  justify-content: space-between;
}
</style>
