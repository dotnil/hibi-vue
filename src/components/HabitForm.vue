<template>
  <div class="toolbar">
    <button v-if="!isFormOpen" @click="openForm">+</button>

    <form v-else @submit.prevent="handleSubmit">
      <input v-model="name" ref="inputRef" type="text" placeholder="habit name" @keydown.esc="closeForm">
      <button type="submit">save</button>
      <button type="button" @click="closeForm">×</button>
    </form>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const inputRef = ref(null)
const emit = defineEmits(['habitCreated'])

const name = ref('')
const isFormOpen = ref(false)

const openForm = async () => {
  isFormOpen.value = true

  await nextTick()

  inputRef.value.focus()
}

const handleSubmit = () => {
  const habit = {
    name: name.value,
    active: true
  }

  emit('habitCreated', habit)
  closeForm()
}

const closeForm = () => {
  name.value = ''
  isFormOpen.value = false
}
</script>

<style scoped>
form {
  display: flex;
  gap: 8px;
  width: 100%;
}

input {
  flex: 1;
  height: 44px;
  padding: 0 12px;

  border: 1px solid #e5e7eb;
  border-radius: 12px;

  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #ddea7c;
  box-shadow: 0 0 0 3px rgba(221, 234, 124, 0.25);
}

.toolbar {
  margin: 20px;
  min-height: 44px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

button {
  height: 44px;
  padding: 0 16px;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  background: transparent;
  color: #6B7280;
  border: 1px solid #E5E7EB;
}

button:hover {
  opacity: 0.9;
  background:  #ddea7c;
}
</style>
