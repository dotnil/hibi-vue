<template>
  <HabitForm @habitCreated="onHabitCreated" />

  <HabitList
    :habits="habitsWeek"
    :metrics="metrics"
    @habitDeleted="onHabitDeleted"
    @habitUpdated="onHabitUpdated"
    @dayClicked="onDayClicked"
  />
  <div class='logged' v-if="currentUser">
    <p>logged in as: {{ currentUser.email }}</p>
    <button @click="onLogout">logout</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { logout } from '../api-client/users'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

import { getCurrentUser } from '../api-client/users'
import { createHabit, list, updateHabit, deleteHabit } from '../api-client/habits.js'

import { listMetrics, createMetric } from '../api-client/metrics'
import { getWeek, formatDate } from '../utils/week.js'
import { makeHabitsWeek } from '../utils/habitsWeek.js'

import HabitForm from '../components/HabitForm.vue'
import HabitList from '../components/HabitList.vue'

const habits = ref([])
const currentUser = ref(null)
const metrics = ref([])

const route = useRoute()
const router = useRouter()

const loadHabits = async () => {
  habits.value = await list()
}

const loadUser = async () => {
  currentUser.value = await getCurrentUser()
}

const loadMetrics = async () => {
  metrics.value = await listMetrics(
    week.value.startDate,
    week.value.endDate
  )
}

onMounted(async () => {
  await loadMetrics()
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

const week = computed(() => getWeek(new Date()))

const onDayClicked = async ({ habit, metricIndex, value }) => {
  const date = week.value.days[metricIndex]

  try {
    await createMetric({
      habit_id: habit.id,
      date: formatDate(date),
      value,
    })

    await loadMetrics()
  } catch (error) {
    console.error(error)
  }
}

const habitsWeek = computed(() =>
  makeHabitsWeek(
    habits.value,
    metrics.value,
    week.value.days
  )
)
</script>

<style scoped>
.logged {
  margin: 20px;
  display: flex;
  justify-content: space-between;
}
</style>
