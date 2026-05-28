<template>
  <ul>
    <li
      v-for='habit in habits'
      :key='habit.id'
    >
      {{ habit.name }}

    <button @click="emit('habitDeleted', habit)">delete</button>
    </li>
  </ul>
</template>

<script setup>
const emit = defineEmits(['habitDeleted'])

defineProps({
  habits: {
    type: Array,
    default: () => []
  }
})
</script>
