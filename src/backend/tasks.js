const back = import.meta.env.VITE_BACK

export const createTask = async task => {
  try {
    const response = await fetch(`${back}/tasks`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })

    const data = await response.json()

    if (response.status != 201) { throw data }
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}
