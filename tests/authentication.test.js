import { afterEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

import App from '../src/App.vue'
import { router } from '../src/router'

const currentUser = { id: 1, email: 'user@example.com' }

const fetchMock = vi.fn(async (url, options = {}) => {
  const method = options.method ?? 'GET'

  if (url === 'http://backend.test/sessions' && method === 'POST') {
    return new Response(JSON.stringify({ ok: true }))
  }

  if (url === 'http://backend.test/sessions/current' && method === 'GET') {
    return new Response(JSON.stringify(currentUser))
  }

  if (url.startsWith('http://backend.test/metrics?') && method === 'GET') {
    return new Response(JSON.stringify([]))
  }

  if (url === 'http://backend.test/habits' && method === 'GET') {
    return new Response(JSON.stringify([]))
  }

  if (url === 'http://backend.test/logout' && method === 'POST') {
    return new Response(JSON.stringify({ ok: true }))
  }

  throw new Error(`Unexpected request: ${method} ${url}`)
})

const mountPage = async (path) => {
  await router.push(path)

  return mount(App, {
    global: {
      plugins: [router],
    },
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
  fetchMock.mockClear()
})

it('logs in and opens the authenticated application', async () => {
  vi.stubGlobal('fetch', fetchMock)

  const wrapper = await mountPage('/login')
  await wrapper.get('input[name="email"]').setValue('user@example.com')
  await wrapper.get('input[name="password"]').setValue('secret')
  await wrapper.get('form').trigger('submit')
  await flushPromises()

  expect(fetchMock).toHaveBeenCalledWith(
    'http://backend.test/sessions',
    expect.objectContaining({
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ email: 'user@example.com', password: 'secret' }),
    }),
  )
  expect(router.currentRoute.value.path).toBe('/')

  await wrapper.get('.icon-button--menu').trigger('click')
  expect(wrapper.get('.menu-content').text()).toContain('user@example.com')

  wrapper.unmount()
})

it('logs out and redirects to login', async () => {
  vi.stubGlobal('fetch', fetchMock)

  const wrapper = await mountPage('/')
  await flushPromises()
  await wrapper.get('.icon-button--menu').trigger('click')
  await wrapper.get('.logout-button').trigger('click')
  await flushPromises()

  expect(fetchMock).toHaveBeenCalledWith(
    'http://backend.test/logout',
    expect.objectContaining({
      method: 'POST',
      credentials: 'include',
    }),
  )
  expect(router.currentRoute.value.path).toBe('/login')
  expect(wrapper.get('h2').text()).toBe('Login')

  wrapper.unmount()
})
