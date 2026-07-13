<template>
<div class="toolbar">
  <button class="icon-button icon-button--add" v-if="!isFormOpen" @click="open"></button>

  <form v-else @submit.prevent="handleSubmit">
    <input
      v-model="name"
      ref="inputRef"
      type="text"
      placeholder="habit name"
      @keydown.esc="closeForm"
    >

    <button class="icon-button icon-button--done" type="submit">
    </button>

    <button class="icon-button icon-button--close" type="button" @click="closeForm">
    </button>
  </form>
</div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const inputRef = ref(null)
const emit = defineEmits(['habitCreated'])

const name = ref('')
const isFormOpen = ref(false)

const open = async () => {
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
  flex: 1;
  gap: 8px;
}

input {
  flex: 1;
  height: 44px;
  padding: 0 12px;
  margin-left: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;

  font-size: 16px;

  transition: border-color .2s ease, box-shadow .2s ease;
}

input:focus {
  outline: none;
  border-color: #ddea7c;
  box-shadow: 0 0 0 3px rgba(221, 234, 124, 0.25);
}

.icon-button--add {
  background: url("@/assets/icons/add-24.svg") no-repeat center;
  background-size: contain;
}

.icon-button--done {
  background: url("@/assets/icons/done-48.svg") no-repeat center;
  background-size: contain;
}

.icon-button--close {
  background: url("@/assets/icons/close-25.svg") no-repeat center;
  background-size: contain;
}

.toolbar {
  flex: 1;
  min-height: 44px;
  justify-content: flex-end;
  display: flex;
  align-items: center;
}
</style>
