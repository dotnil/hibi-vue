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

    <div v-for="habit in habitsDays" :key="habit.id" class="habit-table__row" ref="rowRefs">

      <div class="habit-row__days">
        <div 
          class="habit-progress"
          :style="{ '--progress': habit.progress }"
          >
          <div class="progress-circle"></div>

          <div class="progress-value">
            {{ habit.progress }}%
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

        <div class="habit-row__info">
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

              <div class="habit-goal">
                {{ habit.goal_target }} / {{ habit.goal_period }}
              </div>

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
        </div>

      </div>
    </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted, watch } from 'vue'

const emit = defineEmits(['habitUpdated', 'habitDeleted', 'dayClicked'])
const props = defineProps({
  habitsDays: Array,
  days: Array,
  visibleDays: Number
})

const editingId = ref(null)
const editingName = ref('')
const inputRef = ref(null)
const rowRefs = ref([])

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

const observer = new ResizeObserver(entries => {
  for (const entry of entries) {
    entry.target.style.setProperty(
      '--card-size',
      `${entry.contentRect.width}px`
    )
  }
})


const observedRows = new Set()

watch(
  rowRefs,
  rows => {
    rows.forEach(row => {
      if (!observedRows.has(row)) {
        observer.observe(row)
        observedRows.add(row)
      }
    })
  },
  {
    flush: 'post',
    deep: true
  }
)

onUnmounted(() => {
  observer.disconnect()
})
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

.habit-table__row {
  margin: 20px 0;
  padding: 20px 16px;

  border: 1px solid #e5e7eb;
  border-radius: 14px;

  transition: box-shadow .2s ease;
  position: relative;
  overflow: hidden;
}

.habit-table__row:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07);
  opacity: 1;
}

.habit-row__days {
  display: grid;
  grid-template-columns: var(--habit-columns);

  align-items: center;
  gap: 8px;
  min-height: 32px;
}

.habit-progress {
  position: relative;
  min-height: 32px;
  width: min-content;
  display: flex;
  align-items: center;
}
.progress-circle {
  position: absolute;

  width: calc(36px + (var(--card-size) * 2 - 36px) * var(--progress) / 100);
  height: calc(36px + (var(--card-size) * 2 - 36px) * var(--progress) / 100);

  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%);

  border-radius: 50%;
  background: rgba(0, 0, 0, .08);

  pointer-events: none;
  z-index: 0;
}
.progress-value {
  position: relative;
  z-index: 1;
}

.habit-row__info {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 12px;
}

.habit-name {
  display: flex;
  align-items: center;
  justify-content: space-between;

  flex: 1;
  gap: 12px;
}

.habit-name-text {
  cursor: pointer;
  border-radius: 6px;
}

.habit-name-text:hover {
  background: #f5f5f5;
}

.habit-actions {
  display: flex;
  gap: 8px;

  opacity: 0;
  transition: opacity .15s ease;
}

.habit-table__row:hover .habit-actions {
  opacity: 1;
}

.edit-input {
  width: 100%;

  margin: 0;

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
  display: flex;
  justify-content: center;
  align-items: center;
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
  background: url("@/assets/icons/done-48.svg") no-repeat center;
  background-size: contain;
}

.icon-button--delete {
  background: url("@/assets/icons/delete-25.svg") no-repeat center;
  background-size: contain;
}

.metric {
  width: 20px;
  height: 20px;

  border: 0;
  background: url("@/assets/icons/icon-circle-20.svg") no-repeat center;
  background-size: contain;

  transition: transform .15s ease;
}

.metric--done {
  background-image: url("@/assets/icons/done-bold-48.svg");
}

.metric:hover {
  transform: scale(1.12);
}

</style>
