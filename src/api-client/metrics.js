const back = import.meta.env.VITE_BACK

export const createMetric = async payload => {
  const response = await fetch(`${back}/metrics`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  })

  return response
}

export const listMetrics = async (start, end) => {
  const response = await fetch(
    `${back}/metrics?start=${start}&end=${end}`,
    {
      credentials: 'include',
    }
  )

  return response.json()
}
