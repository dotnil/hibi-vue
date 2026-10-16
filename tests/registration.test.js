import { afterEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

import App from '../src/App.vue'
import { router } from '../src/router'

const mountRegistrationPage = async () => {
  await router.push('/register')

  return mount(App, {
    global: {
      plugins: [router],
    },
  })
}

const fillRegistrationForm = async (wrapper) => {
  await wrapper.get('input[name="email"]').setValue('user@example.com')
  await wrapper.get('input[name="password"]').setValue('secret')
  await wrapper.get('input[name="repeat-password"]').setValue('secret')
}

afterEach(() => {
  vi.unstubAllGlobals()
})

it('registers a user and redirects to login', async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue(
      new Response(JSON.stringify({ id: 1, email: 'user@example.com' }), { status: 201 }),
    )
  vi.stubGlobal('fetch', fetchMock)

  const wrapper = await mountRegistrationPage()
  await fillRegistrationForm(wrapper)
  await wrapper.get('form').trigger('submit')
  await flushPromises()

  expect(fetchMock).toHaveBeenCalledWith(
    'http://backend.test/users',
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ email: 'user@example.com', password: 'secret' }),
    }),
  )
  expect(router.currentRoute.value.path).toBe('/login')
  wrapper.unmount()
})

it('shows an error and stays on registration when email exists', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ error: 'Email already exists' }), { status: 409 }),
      ),
  )

  const wrapper = await mountRegistrationPage()
  await fillRegistrationForm(wrapper)
  await wrapper.get('form').trigger('submit')
  await flushPromises()

  expect(wrapper.get('[role="alert"]').text()).toBe('Email already exists')
  expect(router.currentRoute.value.path).toBe('/register')
  wrapper.unmount()
})
