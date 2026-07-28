<template>
  <main class="app">
    <RouterView />
  </main>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
.app {
  min-width: 360px;
  margin: 0 auto;
}
</style>
