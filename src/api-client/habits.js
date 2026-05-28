const back = import.meta.env.VITE_BACK

export const createHabit = async habit => {
  try {
    const response = await fetch(`${back}/habits`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(habit),
    })

    const data = await response.json()

    if (response.status != 201) { throw data }

    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const list = async () => {
  console.log('LIST CALLED')
  try {
    const response = await fetch(`${back}/habits`)
    const data = await response.json()

    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const deleteHabit = async id => {
  try {
    const response = await fetch(`${back}/habits/${id}`, {
      method: 'DELETE',
    })

    const data = await response.json()

    return data

  } catch (error) {
    return Promise.reject(error)
  }
}
