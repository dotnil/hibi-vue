<template>
  <div v-if="isLoading">
    Loading...🐗
  </div>

  <DemoPage v-else-if="!currentUser" />

  <HomePage
    v-else
    :currentUser="currentUser"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { getCurrentUser } from '../api-client/users'

import DemoPage from './DemoPage.vue'
import HomePage from './HomePage.vue'

const currentUser = ref(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    currentUser.value = await getCurrentUser()
  } catch {
    currentUser.value = null
  } finally {
    isLoading.value = false
  }
})
</script>
