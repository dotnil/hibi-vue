<template>
  <form novalidate @input="onFormInput" @submit.prevent="handleSubmit">
    <div class="field">
      <label for="login-email">Email</label>
      <input
        id="login-email"
        v-model.trim="email"
        :class="{ 'input-error': hasEmailError }"
        :aria-invalid="hasEmailError"
        name="email"
        type="email"
        autocomplete="email"
        required
      >
      <p class="field-error">{{ emailError }}</p>
    </div>

    <div class="field">
      <label for="login-password">Password</label>
      <input
        id="login-password"
        v-model="password"
        :class="{ 'input-error': Boolean(passwordError) }"
        :aria-invalid="Boolean(passwordError)"
        name="password"
        type="password"
        autocomplete="current-password"
        required
      >
      <p class="field-error">{{ passwordError }}</p>
    </div>

    <button type="submit">
      login
    </button>

    <p v-if="props.errorMessage" class="error-message" role="alert">{{ props.errorMessage }}</p>
  </form>
</template>

<script setup>
import { computed, ref } from 'vue'

const emit = defineEmits(['login', 'formChanged'])
const props = defineProps({
  errorMessage: String,
})

const email = ref('')
const password = ref('')
const hasSubmitted = ref(false)

const emailError = computed(() => {
  if (!hasSubmitted.value) return ''

  const trimmedEmail = email.value.trim()

  if (!trimmedEmail) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) return 'Enter a valid email address'

  return ''
})

const passwordError = computed(() => {
  if (!hasSubmitted.value || password.value) return ''

  return 'Password is required'
})

const hasEmailError = computed(() => Boolean(emailError.value))

const onFormInput = () => {
  emit('formChanged')
}

const handleSubmit = () => {
  hasSubmitted.value = true

  if (emailError.value || passwordError.value) return

  emit('login', {
    email: email.value.trim(),
    password: password.value,
  })
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 8px;
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

input.input-error,
input.input-error:hover {
  border-color: #fca5a5;
  box-shadow: none;
}

input.input-error:focus {
  border-color: #fca5a5;
  box-shadow: 0 0 0 3px rgba(252, 165, 165, 0.25);
}

.field-error {
  min-height: 17px;
  margin: 0;
  color: #b91c1c;
  font-size: 14px;
  line-height: 17px;
}

.error-message {
  margin: 0;
  color: #b91c1c;
  font-size: 14px;
}
</style>
