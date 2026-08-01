<template>
  <div class="habit-table" :style="{ '--days-count': visibleDays }">
    <div class="habit-table__header">
      <div class="habit-name"></div>
      <div
        v-for="day in days"
        :key="day.toISOString()"
        class="header-day"
        :class="{ 'header-day--today': isToday(day) }"
        >
        <div>{{ day.getDate() }}</div>
        <div>{{ formatWeekday(day) }}</div>
      </div>
    </div>
    <HabitRow
    v-for="habit in habitsDays"
    :key="habit.id"
    :habit="habit"
    @habit-updated="emit('habitUpdated', $event)"
    @habit-deleted="emit('habitDeleted', $event)"
    @day-clicked="emit('dayClicked', $event)"
    />


  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import HabitRow from './HabitRow.vue'


const emit = defineEmits([
  'habitUpdated',
  'habitDeleted',
  'dayClicked'
])

const props = defineProps({
  habitsDays: Array,
  days: Array,
  visibleDays: Number
})

const isToday = (date) => {
  return date.toDateString() === new Date().toDateString()
}

const formatWeekday = (date) =>
  date
    .toLocaleDateString('en', {
      weekday: 'short'
    })
    .slice(0, 2)

</script>

<style scoped>
.habit-table {
  margin: 0 20px;

  --habit-columns:
    minmax(120px, 2fr)
    repeat(var(--days-count), 0.5fr);
}

.habit-table__header {
  display: grid;
  grid-template-columns: var(--habit-columns);

  min-height: 68px;
  align-items: center;
  gap: 8px;

  position: sticky;
  top: 64px;

  z-index: 10;
  background: white;
  box-shadow: 0 1px 0 #e5e7eb;
  font-weight: bold;
  padding: 20px 14px;
}

.header-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #6B7280;
  font-weight: 300;
  font-size: 10px;
}

.header-day--today {
  font-weight: 700;
  color: #111827;
}

.header-day--today :first-child {
  font-weight: 700;
}

.header-day--today :last-child {
  font-weight: 700;
  color: #111827;
}

</style>
