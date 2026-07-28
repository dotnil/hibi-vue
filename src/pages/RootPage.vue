<template>
  <div v-if="isLoading" class="skeleton" :style="{ '--days-count': DEFAULT_VISIBLE_DAYS }">

    <div class="skeleton__header"></div>

    <div class="skeleton__row" v-for="n in 5" :key="n">
      <div class="skeleton__habit"></div>

      <div
        v-for="day in visibleDays"
        :key="day"
        class="skeleton__day"
        />
      </div>

    </div>

  <DemoPage v-else-if="!currentUser" :visibleDays="visibleDays"/>

  <HomePage
    v-else
    :currentUser="currentUser"
    :visibleDays="visibleDays"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { getCurrentUser } from '../api-client/users'
import { DEFAULT_VISIBLE_DAYS } from '../dates'
import { useVisibleDays } from '../viewport'

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

const visibleDays = useVisibleDays()
</script>

<style scoped>
.skeleton {
  margin: 0 20px;
}

.skeleton__header {
  height: 132px;

  margin-bottom: 20px;
  box-shadow: 0 1px 0 #e5e7eb;
}

.skeleton__row {
  display: grid;
  grid-template-columns:
    minmax(120px, 2fr)
    repeat(var(--days-count), 0.5fr);

  gap: 8px;

  height: 112px;
  padding: 20px 14px;
  margin: 20px 0;

  border: 1px solid #e5e7eb;
  border-radius: 14px;
}

.skeleton__habit,
.skeleton__day {
  height: 32px;

  border-radius: 8px;
  background: #f3f4f6;
}
</style>
