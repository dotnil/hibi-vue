<template>
  <ul>
    <li
      v-for='habit in habits'
      :key='habit.id'
    >
      {{ habit.name }}
    </li>
  </ul>
</template>

<script setup>
defineProps({
  habits: {
    type: Array,
    default: () => []
  }
})
</script>
