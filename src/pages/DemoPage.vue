<template>
<Header>

  <template #actions>
    <HabitForm
      ref="habitFormRef"
      :habit="editingHabit"
      @habitCreated="onHabitCreated"
      @habitUpdated="onHabitUpdated"
      @formClosed="editingHabit = null"
    />
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
    :visibleDays="period.days.length"
    @habitUpdated="onHabitUpdated"
    @habitEditRequested="onHabitEditRequested"
    @habitDeleted="onHabitDeleted"
    @dayClicked="onDayClicked"
  />

</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

import { demoHabits, demoMetrics } from '../demo'
import { getLastDays, formatDate, makeHabitsDays } from '../dates'

import Header from '../components/Header.vue'
import HabitForm from '../components/HabitForm.vue'
import HabitList from '../components/HabitList.vue'

const habits = ref(structuredClone(demoHabits))
const metrics = ref(structuredClone(demoMetrics))
const editingHabit = ref(null)
const habitFormRef = ref(null)
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

const onHabitCreated = ({ goalPeriod, goalTarget, ...habit }) => {
  habits.value.push({
    id: nextId.value,
    ...habit,
    goal_period: goalPeriod,
    goal_target: goalTarget,
  })
}

const onHabitUpdated = habit => {
  const foundHabit = habits.value.find(item => item.id === habit.id)

  if (!foundHabit) return

  foundHabit.name = habit.name
  foundHabit.goal_period = habit.goal_period
  foundHabit.goal_target = habit.goal_target
  foundHabit.color = habit.color

  if (editingHabit.value) {
    habitFormRef.value.close()
    editingHabit.value = null
  }
}

const onHabitEditRequested = async habit => {
  editingHabit.value = habit

  await nextTick()

  habitFormRef.value.open()
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
