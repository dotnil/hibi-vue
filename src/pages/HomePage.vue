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

import { listMetrics } from '../api-client/metrics'
import { getWeekDays } from '../src/utils/week.js'

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
    startDate.value,
    endDate.value
  )
}

onMounted(async () => {
  await loadHabits()
  await loadMetrics()
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

const weekStart = computed(() => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

  const monday = new Date(now)
  monday.setDate(now.getDate() + offset)
  monday.setHours(0, 0, 0, 0)

  return monday
})

const days = computed(() => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart.value)
    d.setDate(weekStart.value.getDate() + i)
    return d
  })
})

const startDate = computed(() =>
  weekStart.value.toISOString().slice(0, 10)
)

const endDate = computed(() => {
  const end = new Date(weekStart.value)
  end.setDate(end.getDate() + 7)
  return end.toISOString().slice(0, 10)
})

const makeHabitsWeek = (habits, metrics, days) => {
  return habits.map(habit => ({
    ...habit,
    metrics: days.map(day => {
      const found = metrics.find(m =>
        Number(m.habit_id) === Number(habit.id) &&
        m.date.slice(0, 10) === day.toISOString().slice(0, 10)
      )

      return found ? found.value : false
    })
  }))
}

const onDayClicked = async ({ habit, metricIndex, value }) => {
  const date = new Date(weekStart.value)

  date.setDate(date.getDate() + metricIndex)

  try {
    await createMetric({
      habit_id: habit.id,
      date: date.toISOString().slice(0, 10),
      value,
    })

    await loadMetrics()
  } catch (error) {
    console.error(error)
  }
}

const habitsWeek = computed(() =>
  makeHabitsWeek(habits.value, metrics.value, days)
)
</script>

<style scoped>
.logged {
  margin: 20px;
  display: flex;
  justify-content: space-between;
}
</style>
