<template>
<div class="toolbar">
  <button class="icon-button icon-button--add" @click="open"></button>

  <dialog ref="dialogRef" @close="onDialogClose">
    <form @submit.prevent="handleSubmit">
      <div class="dialog-header">
        <h2>{{ props.habit ? 'Edit habit' : 'Create habit' }}</h2>
      </div>

      <div class="form-fields">
        <div class="field">
          <label for="habit-name">Habit name</label>
          <input
            id="habit-name"
            v-model="name"
            ref="inputRef"
            type="text"
            placeholder="habit name"
            required
            pattern=".*\S.*"
          >
        </div>

        <div class="field">
          <label for="habit-period">Period</label>
          <select id="habit-period" v-model="goalPeriod">
            <option value="day">Every day</option>
            <option value="week">Days per week</option>
            <option value="month">Days per month</option>
          </select>
        </div>

        <div v-if="goalPeriod !== 'day'" class="field">
          <label for="habit-target">Goal</label>
          <input
            id="habit-target"
            v-model.number="goalTarget"
            type="number"
            min="1"
            :max="goalMaximums[goalPeriod]"
            required
            @focus="selectGoalTarget"
          >
        </div>

        <div class="field">
          <span>Color</span>
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
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="close">Cancel</button>
        <button type="submit">{{ props.habit ? 'Save changes' : 'Create habit' }}</button>
      </div>
    </form>
  </dialog>
</div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { habitColors } from '../habit-colors'

const inputRef = ref(null)
const dialogRef = ref(null)
const emit = defineEmits(['habitCreated', 'habitUpdated', 'formClosed'])
const props = defineProps({
  habit: Object,
  defaultColor: String,
})

const goalMaximums = {
  day: 1,
  week: 7,
  month: 31,
}

const name = ref('')
const goalPeriod = ref('week')
const goalTarget = ref(7)
const selectedColor = ref('')

watch(goalPeriod, period => {
  if (period === 'day') {
    goalTarget.value = 1
    return
  }

  const maximum = goalMaximums[period]

  if (goalTarget.value > maximum) {
    goalTarget.value = maximum
  }
})

const open = async () => {
  if (props.habit) {
    name.value = props.habit.name
    goalPeriod.value = props.habit.goal_period
    goalTarget.value = Number(props.habit.goal_target)
    selectedColor.value = props.habit.color
  } else {
    selectedColor.value = props.defaultColor
  }

  dialogRef.value.showModal()

  await nextTick()

  inputRef.value?.focus()
}

const handleSubmit = () => {
  const habitName = name.value.trim()

  if (!habitName) return

  if (props.habit) {
    emit('habitUpdated', {
      id: props.habit.id,
      name: habitName,
      color: selectedColor.value,
      goal_period: goalPeriod.value,
      goal_target: goalTarget.value,
    })
    return
  }

  const habit = {
    name: habitName,
    active: true,
    color: selectedColor.value,
    goalPeriod: goalPeriod.value,
    goalTarget: goalTarget.value,
  }

  emit('habitCreated', habit)
}

const close = () => {
  dialogRef.value.close()
}

defineExpose({ open, close })

const selectGoalTarget = event => {
  event.target.select()
}

const onDialogClose = () => {
  resetForm()
  emit('formClosed')
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
  flex-direction: column;
  gap: 24px;
}

.dialog-header h2 {
  margin: 0;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

input,
select {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  transition: border-color .2s ease, box-shadow .2s ease;
}

select {
  padding-right: 40px;
  appearance: none;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m4 6 4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
}

input:focus,
select:focus {
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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
  width: 500px;
  max-width: calc(100% - 48px);
  margin: auto;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
}

dialog::backdrop {
  background: rgba(0, 0, 0, 0.2);
}
</style>
