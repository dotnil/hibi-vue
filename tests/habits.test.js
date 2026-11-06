import { afterEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

import App from '../src/App.vue'
import { router } from '../src/router'

const currentUser = { id: 1, email: 'user@example.com' }
let habits = []

const fetchMock = vi.fn(async (url, options = {}) => {
  const method = options.method ?? 'GET'

  if (url === 'http://backend.test/sessions/current' && method === 'GET') {
    return new Response(JSON.stringify(currentUser))
  }

  if (url.startsWith('http://backend.test/metrics?') && method === 'GET') {
    return new Response(JSON.stringify([]))
  }

  if (url === 'http://backend.test/habits' && method === 'GET') {
    return new Response(JSON.stringify(habits))
  }

  if (url === 'http://backend.test/habits' && method === 'POST') {
    const payload = JSON.parse(options.body)
    const habit = {
      id: habits.length + 1,
      active: payload.active,
      name: payload.name,
      color: payload.color,
      goal_period: payload.goalPeriod,
      goal_target: payload.goalTarget,
    }

    habits = [...habits, habit]

    return new Response(JSON.stringify(habit), { status: 201 })
  }

  if (url.startsWith('http://backend.test/habits/') && method === 'PATCH') {
    const payload = JSON.parse(options.body)
    const id = Number(url.split('/').at(-1))
    const habit = {
      ...habits.find((item) => item.id === id),
      name: payload.name,
      color: payload.color,
      goal_period: payload.goalPeriod,
      goal_target: payload.goalTarget,
    }

    habits = habits.map((item) => (item.id === id ? habit : item))

    return new Response(JSON.stringify(habit))
  }

  if (url.startsWith('http://backend.test/habits/') && method === 'DELETE') {
    const id = Number(url.split('/').at(-1))
    const habit = habits.find((item) => item.id === id)

    habits = habits.filter((item) => item.id !== id)

    return new Response(JSON.stringify(habit))
  }

  throw new Error(`Unexpected request: ${method} ${url}`)
})

const mountHomePage = async () => {
  await router.push('/')

  const wrapper = mount(App, {
    global: {
      plugins: [router],
    },
  })

  await flushPromises()

  return wrapper
}

afterEach(() => {
  vi.unstubAllGlobals()
  fetchMock.mockClear()
  habits = []
})

it('creates a habit and displays it', async () => {
  vi.stubGlobal('fetch', fetchMock)

  const wrapper = await mountHomePage()
  await wrapper.get('.icon-button--add').trigger('click')
  await wrapper.get('#habit-name').setValue('Read 20 min')
  await wrapper.get('dialog form').trigger('submit')
  await flushPromises()

  expect(fetchMock).toHaveBeenCalledWith(
    'http://backend.test/habits',
    expect.objectContaining({
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        name: 'Read 20 min',
        active: true,
        color: '#DDEA7C',
        goalPeriod: 'week',
        goalTarget: 7,
      }),
    }),
  )
  expect(wrapper.get('.habit-name-text').text()).toBe('Read 20 min')

  wrapper.unmount()
})

it('updates a habit and displays the changes', async () => {
  habits = [
    {
      id: 1,
      active: true,
      name: 'Read 20 min',
      color: '#DDEA7C',
      goal_period: 'week',
      goal_target: 3,
    },
  ]
  vi.stubGlobal('fetch', fetchMock)

  const wrapper = await mountHomePage()
  await wrapper.get('.habit-name-text').trigger('click')
  await wrapper.get('#habit-name').setValue('Read 30 min')
  await wrapper.get('#habit-period').setValue('month')
  await wrapper.get('#habit-target').setValue(10)
  await wrapper.get('dialog form').trigger('submit')
  await flushPromises()

  expect(fetchMock).toHaveBeenCalledWith(
    'http://backend.test/habits/1',
    expect.objectContaining({
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify({
        name: 'Read 30 min',
        color: '#DDEA7C',
        goalPeriod: 'month',
        goalTarget: 10,
      }),
    }),
  )
  expect(wrapper.get('.habit-name-text').text()).toBe('Read 30 min')
  expect(wrapper.get('.habit-goal').text()).toBe('10/month')

  wrapper.unmount()
})

it('deletes a habit from the list', async () => {
  habits = [
    {
      id: 1,
      active: true,
      name: 'Read 20 min',
      color: '#DDEA7C',
      goal_period: 'week',
      goal_target: 3,
    },
  ]
  vi.stubGlobal('fetch', fetchMock)

  const wrapper = await mountHomePage()
  await wrapper.get('.icon-button--delete').trigger('click')
  await flushPromises()

  expect(fetchMock).toHaveBeenCalledWith(
    'http://backend.test/habits/1',
    expect.objectContaining({
      method: 'DELETE',
      credentials: 'include',
    }),
  )
  expect(wrapper.find('.habit-name-text').exists()).toBe(false)

  wrapper.unmount()
})
