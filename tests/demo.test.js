import { afterEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

import App from '../src/App.vue'
import { router } from '../src/router'

const fetchMock = vi.fn(async (url, options = {}) => {
  const method = options.method ?? 'GET'

  if (url === 'http://backend.test/sessions/current' && method === 'GET') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  throw new Error(`Unexpected request: ${method} ${url}`)
})

afterEach(() => {
  vi.unstubAllGlobals()
  fetchMock.mockClear()
})

it('creates and completes a habit locally in demo mode', async () => {
  vi.stubGlobal('fetch', fetchMock)
  await router.push('/')

  const wrapper = mount(App, {
    global: {
      plugins: [router],
    },
  })
  await flushPromises()

  await wrapper.get('.icon-button--add').trigger('click')
  await wrapper.get('#habit-name').setValue('Practice piano')
  await wrapper.get('dialog form').trigger('submit')

  const newHabit = wrapper.findAll('.habit-table__row').at(-1)

  expect(newHabit.get('.habit-name-text').text()).toBe('Practice piano')
  expect(newHabit.get('.progress-value').text()).toBe('0%')

  await newHabit.findAll('.habit-day').at(-1).trigger('click')

  expect(newHabit.findAll('.metric').at(-1).classes()).toContain('metric--done')
  expect(newHabit.get('.progress-value').text()).toBe('14%')
  expect(fetchMock).toHaveBeenCalledTimes(1)
  expect(fetchMock).toHaveBeenCalledWith(
    'http://backend.test/sessions/current',
    expect.objectContaining({ credentials: 'include' }),
  )

  wrapper.unmount()
})
