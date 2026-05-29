<template>
  <ul>
    <li v-for="habit in habits" :key="habit.id" class="row">

      <div v-if="editingId !== habit.id">
        {{ habit.name }}
        <button @click="startEdit(habit)">update</button>
      </div>

      <div v-else>
        <input v-model="editingName" />
        <button @click="save(habit)">save</button>
      </div>

      <button @click="emit('habitDeleted', habit)">delete</button>

    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['habitUpdated', 'habitDeleted'])
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

defineProps({
  habits: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
