const back = import.meta.env.VITE_BACK

export const createUser = async credentials => {
  const response = await fetch(`${back}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const data = await response.json()
    throw data
  }

  return response.json()
}

export const login = async credentials => {
  const response = await fetch(`${back}/sessions`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const data = await response.json()
    throw data
  }

  return response.json()
}

export const getCurrentUser = async () => {
  const response = await fetch(`${back}/sessions/current`, {
    credentials: 'include',
  })

  const data = await response.json()

  if (!response.ok) {
    return null
  }

  return data
}

export const logout = async () => {
  const response = await fetch(`${back}/logout`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    const data = await response.json()
    throw data
  }

  return response.json()
}
