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

export const getCurrentUser = async () => {
  const response = await fetch(`${import.meta.env.VITE_BACK}/sessions/current`, {
    credentials: 'include',
  })

  const data = await response.json()

  if (!response.ok) { return null }

  return data
}

export const logout = async () => {
  const response = await fetch(`${import.meta.env.VITE_BACK}/logout`, {
    method: 'POST',
    credentials: 'include',
  })

  return response.json()
}
