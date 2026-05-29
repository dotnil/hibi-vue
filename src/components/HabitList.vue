<template>
  <ul>
    <li
      v-for='habit in habits'
      :key='habit.id'
    >
      {{ habit.name }}

    <button @click="emit('habitUpdated', habit)">update</button>
    <button @click="emit('habitDeleted', habit)">delete</button>
    </li>
  </ul>
</template>

<script setup>
const emit = defineEmits(['habitUpdated', 'habitDeleted'])

defineProps({
  habits: {
    type: Array,
    default: () => []
  }
})
</script>
