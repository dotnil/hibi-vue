<template>
  <div class="habit-table">
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

    <div v-for="habit in habits" :key="habit.id" class="habit-table__row">

      <div class="habit-name">
        <span
          v-if="editingId !== habit.id" 
          @click="startEdit(habit)"
          class="habit-name-text"
          >
          {{ habit.name }}
        </span>

          <input
          v-else
          ref="inputRef"
          v-model="editingName"
          @keydown.enter.prevent="save"
          @keydown.esc.prevent="cancelEdit"
          @blur="save"
          class="edit-input"
          />

        <div class="habit-actions">
          <button
            v-if="editingId !== habit.id"
            class="icon-button icon-button--edit"
            @click="startEdit(habit)"
          />
          <button
            v-else
            class="icon-button icon-button--done"
            @click="save"
          />
          <button
            class="icon-button icon-button--delete"
            @click="emit('habitDeleted', habit)"
          />
        </div>
      </div>


      <div 
        class="habit-day"
        v-for="(metric, index) in habit.metrics"
        :key="index"
        @click="onDayClick(habit, index)"
      >
      <div
        class="metric"
        :class="{ 'metric--done': metric }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const emit = defineEmits(['habitUpdated', 'habitDeleted', 'dayClicked'])
const props = defineProps({
  habits: Array,
  days: Array
})

const editingId = ref(null)
const editingName = ref('')
const inputRef = ref(null)

const startEdit = (habit) => {
  editingId.value = habit.id
  editingName.value = habit.name

  nextTick(() => {
    setTimeout(() => {
      const inputs = document.querySelectorAll('.edit-input')
      const currentInput = Array.from(inputs).find(input => 
        input.value === editingName.value
      )

      if (currentInput) {
        currentInput.focus()
        currentInput.select()
      }
    }, 50)
  })
}

const cancelEdit = () => {
  editingId.value = null
  editingName.value = ''
}

const save = () => {
  const name = editingName.value.trim()

  if (name && editingId.value) {
    emit('habitUpdated', {
      id: editingId.value,
      name: name
    })
  }

  editingId.value = null
  editingName.value = ''
}

const isToday = (date) => {
  return date.toDateString() === new Date().toDateString()
}

const formatWeekday = (date) =>
  date
    .toLocaleDateString('en', {
      weekday: 'short'
    })
    .slice(0, 2)

const onDayClick = (habit, index) => {
  emit('dayClicked', {
    habit,
    metricIndex: index,
    value: !habit.metrics[index]
  })
}
</script>

<style scoped>
.habit-table {
  margin: 20px;
}

.habit-table__row,
.habit-table__header {
  display: grid;
  grid-template-columns:
    minmax(180px, 2fr)
    repeat(7, 0.5fr);
  min-height: 68px;
  align-items: center;
  gap: 8px;
}

.habit-table__header {
  font-weight: bold;
  padding: 20px 14px;
}

.header-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #7f7f7f;
}

.header-day :first-child {
  font-weight: 300;
  font-size: 18px;
}

.header-day :last-child {
  font-weight: 300;
  font-size: 12px;
  color: #6B7280;
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

.habit-table__row {
  margin: 20px 0;
  border-radius: 14px;
  padding: 20px 14px;
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
}

.habit-table__row:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07);
}

.habit-name {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.habit-name-text {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
}

.habit-name-text:hover {
  background: #f5f5f5;
}

.habit-actions {
  display: flex;
  gap: 8px;

  opacity: 0;
  transition: opacity .15s;
}

.habit-table__row:hover .habit-actions {
  opacity: 1;
}

.edit-input {
  width: 100%;

  margin: 0;
  padding: 0;

  border: 0;
  outline: none;
  background: transparent;

  padding: 4px 8px;
  font: inherit;
  color: inherit;
  line-height: inherit;
  height: 20px;
  box-sizing: border-box;
}

.habit-day {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.22s ease;
  transform-origin: center center;
}

.icon-button {
  width: 22px;
  height: 22px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
  opacity: .55;
}

.icon-button:hover {
  opacity: 1;
}

.icon-button--edit {
  background: url("@/assets/icons/edit-25.svg") no-repeat center;
  background-size: contain;
}

.icon-button--done {
  background: url("@/assets/icons/done-25.svg") no-repeat center;
  background-size: contain;
}

.icon-button--delete {
  background: url("@/assets/icons/delete-25.svg") no-repeat center;
  background-size: contain;
}

.metric {
  width: 18px;
  height: 18px;

  border: 1px solid #cbd5e1;
  border-radius: 50%;

  transition: .15s;
}

.metric--done {
  background: #cbd5e1;
}

.metric:hover {
  transform: scale(1.12);
}
</style>
