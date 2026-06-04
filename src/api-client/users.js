const back = import.meta.env.VITE_BACK

export const createUser = async credentials => {
  try {
    const response = await fetch(`${back}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    return data

  } catch (error) {
    return Promise.reject(error)
  }
}

export const login = async credentials => {
  try {
    const response = await fetch(`${back}/sessions`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    return data

  } catch (error) {
    return Promise.reject(error)
  }
}
