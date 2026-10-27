import { afterEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

import App from '../src/App.vue'
import { router } from '../src/router'

const currentUser = { id: 1, email: 'user@example.com' }
const habit = {
  id: 1,
  active: true,
  name: 'Read 20 min',
  color: '#DDEA7C',
  goal_period: 'week',
  goal_target: 3,
}
let metrics = []

const fetchMock = vi.fn(async (url, options = {}) => {
  const method = options.method ?? 'GET'

  if (url === 'http://backend.test/sessions/current' && method === 'GET') {
    return new Response(JSON.stringify(currentUser))
  }

  if (url.startsWith('http://backend.test/metrics?') && method === 'GET') {
    return new Response(JSON.stringify(metrics))
  }

  if (url === 'http://backend.test/habits' && method === 'GET') {
    return new Response(JSON.stringify([habit]))
  }

  if (url === 'http://backend.test/metrics' && method === 'POST') {
    const payload = JSON.parse(options.body)

    metrics = [{ id: 1, user_id: 1, ...payload }]

    return new Response(JSON.stringify({}), { status: 201 })
  }

  throw new Error(`Unexpected request: ${method} ${url}`)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  fetchMock.mockClear()
  metrics = []
})

it('marks today as complete and updates weekly progress', async () => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 9, 21, 12))
  vi.stubGlobal('fetch', fetchMock)
  await router.push('/')

  const wrapper = mount(App, {
    global: {
      plugins: [router],
    },
  })
  await flushPromises()

  expect(wrapper.get('.progress-value').text()).toBe('0%')

  await wrapper.findAll('.habit-day').at(-1).trigger('click')
  await flushPromises()

  expect(fetchMock).toHaveBeenCalledWith(
    'http://backend.test/metrics',
    expect.objectContaining({
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ habit_id: 1, date: '2026-10-21', value: true }),
    }),
  )
  expect(wrapper.findAll('.metric').at(-1).classes()).toContain('metric--done')
  expect(wrapper.get('.progress-value').text()).toBe('33%')

  wrapper.unmount()
})
