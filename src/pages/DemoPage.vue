<template>
<Header>

  <template #actions>
    <HabitForm @habitCreated="onHabitCreated" />
  </template>


  <template #menu>

    <RouterLink to="/login">
      Login
    </RouterLink>

    <RouterLink to="/register">
      Register
    </RouterLink>

  </template>

</Header>

  <HabitList
    :habitsDays="habitsDays"
    :days="period.days"
    @habitUpdated="onHabitUpdated"
    @habitDeleted="onHabitDeleted"
    @dayClicked="onDayClicked"
  />

</template>

<script setup>
import { ref, computed } from 'vue'

import { demoHabits, demoMetrics } from '../demo'
import { getLastDays, formatDate, makeHabitsDays } from '../dates'

import Header from '../components/Header.vue'
import HabitForm from '../components/HabitForm.vue'
import HabitList from '../components/HabitList.vue'

const habits = ref(structuredClone(demoHabits))
const metrics = ref(structuredClone(demoMetrics))
const props = defineProps({
  visibleDays: Number,
})

const period = computed(() => getLastDays(new Date(), props.visibleDays))

const habitsDays = computed(() =>
  makeHabitsDays(
    habits.value,
    metrics.value,
    period.value.days
  )
)

const nextId = computed(() =>
  Math.max(0, ...habits.value.map(habit => habit.id)) + 1
)

const onHabitCreated = habit => {
  habits.value.push({
    id: nextId.value,
    ...habit,
  })
}

const onHabitUpdated = habit => {
  const foundHabit = habits.value.find(item => item.id === habit.id)

  if (!foundHabit) return

  foundHabit.name = habit.name
}

const onHabitDeleted = habit => {
  habits.value = habits.value.filter(item => item.id !== habit.id)
}

const onDayClicked = ({ habit, metricIndex, value }) => {
  const date = formatDate(period.value.days[metricIndex])

  const metric = metrics.value.find(item =>
    item.habit_id === habit.id &&
    item.date === date
  )

  if (metric) {
    metric.value = value
    return
  }

  metrics.value.push({
    habit_id: habit.id,
    date,
    value,
  })
}
</script>
