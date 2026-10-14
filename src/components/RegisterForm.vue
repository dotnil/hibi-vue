<template>
  <form @submit.prevent="handleSubmit">
    <div class="field">
      <label for="register-email">Email</label>
      <input id="register-email" v-model.trim="email" name="email" type="email" autocomplete="email" required>
    </div>

    <div class="field">
      <label for="register-password">Password</label>
      <input id="register-password" v-model="password" name="password" type="password" autocomplete="new-password" required @input="validateRepeatPassword">
    </div>

    <div class="field">
      <label for="register-repeat-password">Repeat password</label>
      <input id="register-repeat-password" ref="repeatPasswordRef" v-model="repeatPassword" name="repeat-password" type="password" autocomplete="new-password" required @input="validateRepeatPassword">
    </div>

    <button type="submit">
      register
    </button>

    <p v-if="props.errorMessage" class="error-message" role="alert">{{ props.errorMessage }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['register'])
const props = defineProps({
  errorMessage: String,
})

const email = ref('')
const password = ref('')
const repeatPassword = ref('')
const repeatPasswordRef = ref(null)

const validateRepeatPassword = () => {
  repeatPasswordRef.value?.setCustomValidity(
    password.value === repeatPassword.value ? '' : 'Passwords do not match'
  )
}

const handleSubmit = () => {
  emit('register', {
    email: email.value.trim(),
    password: password.value,
  })
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
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
  background: #ddea7c;
}

input {
  height: 44px;
  padding: 0 12px;
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

input:hover {
  outline: none;
  border-color: #ddea7c;
  box-shadow: 0 0 0 3px rgba(221, 234, 124, 0.25);
}

.error-message {
  margin: 0;
  color: #b91c1c;
  font-size: 14px;
}
</style>
