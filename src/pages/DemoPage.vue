<template>
  <Header>
    <HabitForm @habitCreated="onHabitCreated" />
  </Header>

  <HabitList
    :habits="habitsWeek"
    :days="week.days"
    @habitUpdated="onHabitUpdated"
    @habitDeleted="onHabitDeleted"
    @dayClicked="onDayClicked"
  />

</template>

<script setup>
import { ref, computed } from 'vue'

import { demoHabits, demoMetrics } from '../demo'
import { getWeek, formatDate } from '../utils/week'
import { makeHabitsWeek } from '../utils/habitsWeek'

import Header from '../components/Header.vue'
import HabitForm from '../components/HabitForm.vue'
import HabitList from '../components/HabitList.vue'

const habits = ref(structuredClone(demoHabits))
const metrics = ref(structuredClone(demoMetrics))

const week = computed(() => getWeek(new Date()))

const habitsWeek = computed(() =>
  makeHabitsWeek(
    habits.value,
    metrics.value,
    week.value.days
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
  const date = formatDate(week.value.days[metricIndex])

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
