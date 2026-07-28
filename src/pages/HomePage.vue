<template>
<Header>

  <template #actions>
    <HabitForm @habitCreated="onHabitCreated" />
  </template>


  <template #menu>

    <p>{{ props.currentUser.email }}</p>

    <button @click="onLogout">
      Logout
    </button>

  </template>

</Header>

  <HabitList
    :habitsDays="habitsDays"
    :days="period.days"
    :visibleDays="period.days.length"
    @habitDeleted="onHabitDeleted"
    @habitUpdated="onHabitUpdated"
    @dayClicked="onDayClicked"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { logout } from '../api-client/users'
import { useRouter } from 'vue-router'

import { createHabit, listHabits, updateHabit, deleteHabit } from '../api-client/habits'

import { listMetrics, createMetric } from '../api-client/metrics'
import { getLastDays, formatDate, makeHabitsDays, getCalendarPeriod, calculateProgress } from '../dates'

import HabitForm from '../components/HabitForm.vue'
import HabitList from '../components/HabitList.vue'
import Header from '../components/Header.vue'

const habits = ref([])
const metrics = ref([])

const router = useRouter()

const props = defineProps({
  currentUser: Object,
  visibleDays: Number,
})

const loadHabits = async () => {
  habits.value = await listHabits()
}

const loadMetrics = async () => {
  metrics.value = await listMetrics(
    period.value.startDate,
    period.value.endDate
  )
}

onMounted(async () => {
  await loadMetrics()
  await loadHabits()
})

const onLogout = async () => {
  try {
    await logout()
    await router.push('/login')
  } catch (error) {
    console.error('logout failed:', error)
  }
}

const onHabitCreated = async (habit) => {
  try {
    await createHabit(habit)
    await loadHabits()
  } catch (error) {
    console.error('create habit failed:', error)
  }
}

const onHabitUpdated = async (habit) => {
  try {
    await updateHabit(habit)
    await loadHabits()
  } catch (error) {
    console.error('update habit failed:', error)
  }
}

const onHabitDeleted = async (habit) => {
  try {
    await deleteHabit(habit.id)
    await loadHabits()
  } catch (error) {
    console.error('delete habit failed:', error)
  }
}

const period = computed(() => getLastDays(new Date(), props.visibleDays))

const onDayClicked = async ({ habit, metricIndex, value }) => {
  const date = period.value.days[metricIndex]

  try {
    await createMetric({
      habit_id: habit.id,
      date: formatDate(date),
      value,
    })

    await loadMetrics()
  } catch (error) {
    console.error('toggle metric failed:', error)
  }
}

const habitsDays = computed(() =>
  makeHabitsDays(
    habits.value,
    metrics.value,
    period.value.days
  )
)


</script>
