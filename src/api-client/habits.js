const back = import.meta.env.VITE_BACK

export const createHabit = async habit => {
  const response = await fetch(`${back}/habits`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(habit),
  })

  if (!response.ok) {
    const data = await response.json()
    throw data
  }

  return response.json()
}

export const updateHabit = async habit => {
  const payload = {
    name: habit.name,
    color: habit.color,
    goalPeriod: habit.goal_period,
    goalTarget: habit.goal_target
  }

  const response = await fetch(`${back}/habits/${habit.id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const data = await response.json()
    throw data
  }

  return response.json()
}

export const listHabits = async () => {
  const response = await fetch(`${back}/habits`, {
    credentials: 'include',
  })

  if (!response.ok) {
    const data = await response.json()
    throw data
  }

  return response.json()
}

export const deleteHabit = async id => {
  const response = await fetch(`${back}/habits/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    const data = await response.json()
    throw data
  }

  return response.json()
}
