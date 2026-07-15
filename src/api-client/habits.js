const back = import.meta.env.VITE_BACK

export const createHabit = async habit => {
  const response = await fetch(`${back}/habits`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(habit),
  })

  const data = await response.json()

  if (response.status !== 201) {
    throw data
  }

  return data
}

export const updateHabit = async habit => {
  const payload = { name: habit.name }

  const response = await fetch(`${back}/habits/${habit.id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return response.json()
}

export const listHabit = async () => {
  const response = await fetch(`${back}/habits`, {
    credentials: 'include',
  })

  return response.json()
}

export const deleteHabit = async id => {
  const response = await fetch(`${back}/habits/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  return response.json()
}
