<template>
  <div class="habit-table__row" ref="rowRef">
    <div class="habit-row__days">
      <div class="habit-progress" :style="{ '--progress': habit.progress, '--habit-color': habit.color }">
        <div class="progress-circle"></div>
        <div class="progress-value">{{ habit.progress }}%</div>
      </div>

      <div
        v-for="(metric, index) in habit.metrics"
        :key="index"
        class="habit-day"
        @click="onDayClick(index)"
      >
        <div class="metric" :class="{ 'metric--done': metric }"></div>
      </div>
    </div>

    <div class="habit-row__info">
      <div class="habit-name">
        <span
          class="habit-name-text"
          @click="emit('habitEditRequested', habit)"
        >
          {{ habit.name }}
        </span>

        <div class="habit-goal">
          {{ habit.goal_target }}/{{ habit.goal_period }}
        </div>

        <div class="habit-actions">
          <button
            class="icon-button icon-button--edit"
            @click="emit('habitEditRequested', habit)"
          ></button>
          <button class="icon-button icon-button--delete" @click="emit('habitDeleted', habit)"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits([
  'habitEditRequested',
  'habitDeleted',
  'dayClicked'
])

const { habit } = defineProps({
  habit: Object
})

const onDayClick = (index) => {
  emit('dayClicked', {
    habit,
    metricIndex: index,
    value: !habit.metrics[index]
  })
}

const rowRef = ref(null)

const observer = new ResizeObserver(entries => {
  for (const entry of entries) {
    entry.target.style.setProperty(
      '--card-size',
      `${entry.contentRect.width}px`
    )
  }
})

onMounted(() => {
  observer.observe(rowRef.value)
})

onUnmounted(() => {
  observer.disconnect()
})
</script>

<style scoped>
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
  position: relative;
  z-index: 1;
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
  background: var(--habit-color);

  pointer-events: none;
  z-index: 0;
}
.progress-value {
  position: relative;
}

.habit-row__info {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 12px;
  position: relative;
  z-index: 1;
}

.habit-name {
  display: flex;
  align-items: center;
  justify-content: space-between;

  min-width:0;
  flex: 1;
  gap: 12px;
}

.habit-goal {
  flex-shrink:0;
  white-space:nowrap;
  font-size: 0.8rem;
  color: #6b7280;
  opacity: 0;
  transition: opacity .15s ease;
}

.habit-table__row:hover .habit-goal {
  opacity: .7;
}

.habit-name-text {
  cursor: pointer;
  border-radius: 6px;
}
.habit-name-text {
  display: block;
  height: 24px;
  line-height: 24px;
}
.habit-name-text:hover {
  background: #f5f5f5;
}

.habit-actions {
  display: flex;
  gap: 8px;

  flex-shrink:0;
  opacity: 0;
  transition: opacity .15s ease;
}

.habit-table__row:hover .habit-actions {
  opacity: 1;
}

.habit-day {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.22s ease;
  transform-origin: center center;

  position: relative;
  z-index: 1;
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
