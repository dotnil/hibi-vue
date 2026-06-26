<template>
  <ul>
    <li v-for="habit in habits" :key="habit.id" class="row card">

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

const emit = defineEmits([
  'habitUpdated',
  'habitDeleted',
  'dayClicked',
])

const props = defineProps({
  habits: Array,
  // TODO: check if used
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

const onDayClick = (habit, index) => {
  const value = !habit.metrics[index]

  emit('dayClicked', {
    habit,
    metricIndex: index,
    value,
  })
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
