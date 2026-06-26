export const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const getWeek = (date) => {
  const now = new Date(date)

  const dayOfWeek = now.getDay()
  const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() + offset)
  weekStart.setHours(0, 0, 0, 0)

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  const startDate = formatDate(weekStart)

  const endDate = new Date(weekStart)
  endDate.setDate(endDate.getDate() + 7)

  return {
    weekStart,
    days,
    startDate,
    endDate: formatDate(endDate),
  }
}
