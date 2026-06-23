<template>
  <ul>
    <li v-for="habit in habitsWeek" :key="habit.id" class="row card">

      <div v-if="editingId !== habit.id">
        {{ habit.name }}
        <button @click="startEdit(habit)">update</button>
      </div>

      <div v-else>
        <input v-model="editingName" />
        <button @click="save(habit)">save</button>
      </div>

      <button @click="emit('habitDeleted', habit)">delete</button>

      <div
        v-for="(metric, index) in habit.metrics"
        :key="index"
        @click="onDayClick(habit, index)"
      >
        {{ metric ? '●' : '○' }}
      </div>

    </li>
  </ul>
</template>

<script setup>
import { ref, computed } from 'vue'
import { createMetric } from '../api-client/metrics'

const emit = defineEmits([
  'habitUpdated',
  'habitDeleted',
  'refreshMetrics'
])

const props = defineProps({
  habits: Array,
  metrics: Array,
})

const editingId = ref(null)
const editingName = ref('')

const startEdit = (habit) => {
  editingId.value = habit.id
  editingName.value = habit.name
}

const save = (habit) => {
  emit('habitUpdated', {
    ...habit,
    name: editingName.value
  })

  editingId.value = null
  editingName.value = ''
}

const calcWeekDays = (now) => {
  const monday = new Date(now)
  const dayOfWeek = monday.getDay()

  const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

  monday.setDate(monday.getDate() + offset)
  monday.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    return date
  })
}

const days = calcWeekDays(new Date())

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

const habitsWeek = computed(() =>
  makeHabitsWeek(props.habits, props.metrics, days)
)

const onDayClick = async (habit, index) => {
  const date = days[index]
  const value = !habit.metrics[index]

  try {
    const res = await createMetric({
      habit_id: habit.id,
      date: date.toISOString().slice(0, 10),
      value,
    })

    console.log('🐗 saved', res.status)

    emit('refreshMetrics')

  } catch (error) {
    console.error('💩 error', error)
  }
}
</script>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 12px;
}

ul {
  margin: 20px;
}
</style>
