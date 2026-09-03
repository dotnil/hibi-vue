<template>
<div class="toolbar">
  <button class="icon-button icon-button--add" @click="open"></button>

  <dialog ref="dialogRef" @close="resetForm">
    <form @submit.prevent="handleSubmit">
      <input
        v-model="name"
        ref="inputRef"
        type="text"
        placeholder="habit name"
        required
      >
      <input
        v-model.number="goalTarget"
        type="number"
        min="1"
        :max="goalMaximums[goalPeriod]"
        @focus="selectGoalTarget"
      />

      <select v-model="goalPeriod">
        <option value="day">day</option>
        <option value="week">week</option>
        <option value="month">month</option>
      </select>

      <div class="color-picker" aria-label="Habit color">
        <button
          v-for="color in habitColors"
          :key="color"
          class="color-option"
          :class="{ 'color-option--selected': selectedColor === color }"
          :style="{ backgroundColor: color }"
          :aria-label="color"
          type="button"
          @click="selectedColor = color"
        ></button>
      </div>

      <button class="icon-button icon-button--done" type="submit">
      </button>

      <button class="icon-button icon-button--close" type="button" @click="close">
      </button>
    </form>
  </dialog>
</div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { habitColors, getRandomHabitColor } from '../habit-colors'

const inputRef = ref(null)
const dialogRef = ref(null)
const emit = defineEmits(['habitCreated'])

const goalMaximums = {
  day: 1,
  week: 7,
  month: 28,
}

const name = ref('')
const goalPeriod = ref('week')
const goalTarget = ref(7)
const selectedColor = ref('')

watch(goalPeriod, period => {
  const maximum = goalMaximums[period]

  if (goalTarget.value > maximum) {
    goalTarget.value = maximum
  }
})

const open = async () => {
  selectedColor.value = getRandomHabitColor()
  dialogRef.value.showModal()

  await nextTick()

  inputRef.value?.focus()
}

const handleSubmit = () => {
  const habitName = name.value.trim()

  if (!habitName) return

  const habit = {
    name: habitName,
    active: true,
    color: selectedColor.value,
    goalPeriod: goalPeriod.value,
    goalTarget: goalTarget.value,
  }

  emit('habitCreated', habit)
  close()
}

const close = () => {
  dialogRef.value.close()
}

const selectGoalTarget = event => {
  event.target.select()
}

const resetForm = () => {
  name.value = ''
  goalPeriod.value = 'week'
  goalTarget.value = 7
  selectedColor.value = ''
}
</script>

<style scoped>
form {
  display: flex;
  flex: 1;
  gap: 8px;
  flex-wrap: wrap;
}

input {
  flex: 1;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;

  font-size: 16px;

  transition: border-color .2s ease, box-shadow .2s ease;
}

input:focus {
  outline: none;
  border-color: #ddea7c;
  box-shadow: 0 0 0 3px rgba(221, 234, 124, 0.25);
}

input:invalid:focus {
  border-color: #fca5a5;
  box-shadow: 0 0 0 3px rgba(252, 165, 165, 0.25);
}

.icon-button--add {
  background: url("@/assets/icons/add-24.svg") no-repeat center;
  background-size: contain;
}

.icon-button--done {
  background: url("@/assets/icons/done-48.svg") no-repeat center;
  background-size: contain;
}

.icon-button--close {
  background: url("@/assets/icons/close-25.svg") no-repeat center;
  background-size: contain;
}

.toolbar {
  flex: 1;
  min-height: 44px;
  justify-content: flex-end;
  display: flex;
  align-items: center;
}

.color-picker {
  display: flex;
  gap: 8px;
}

.color-option {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
}

.color-option--selected {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

dialog {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
}

dialog::backdrop {
  background: rgba(0, 0, 0, 0.2);
}
</style>
